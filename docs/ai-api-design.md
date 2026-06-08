# AI / API 設計書 — 占いロジックのAI抽出（プロバイダ切替可能版）

> 目的: 現在ハードコードされている「占いの解釈ロジック」を LLM API に置き換え、
> 計算結果から **個別最適化された自然言語の鑑定文** を生成する。
> **AIプロバイダ（Gemini / OpenAI / Claude）は env で切り替え可能**にし、コスト・品質を比較しながら本採用できる設計とする。

---

## 1. 基本方針

### 1-1. 「計算」と「解釈」を分離する
現在のコードはすでに2層に分かれている。AI化するのは **解釈層だけ** で、計算層はローカルに残す。

| 層 | 中身 | 例（実コード） | AI化 |
|----|------|----------------|------|
| **① 入力層** | プロフィール収集 | `index.html` のフォーム → `localStorage['xten.profile']` | ✕ そのまま |
| **② 計算層** | 暦・天文の決定論的計算 | `calcDayPillar` / `calcLagna` / `calcShukuyo` / `calcAtmakaraka` / `calcDasha` | ✕ **ローカル維持** |
| **③ 解釈層** ★ | 計算結果 → 鑑定文 | `analyzeFourPillars` / `analyzeVedic` / `analyzeShukuyo` / `calcTendency` | ◎ **AIに置換** |
| **④ 描画層** | HTML生成 | 各JSの render 部 | △ 構造はそのまま、文章だけAI由来に |

- **計算層をAIにしない理由**: 生年月日→日柱・宿曜は数学。0円・即時・再現性あり。LLMだと誤り・揺れが出る。
- **解釈層をAIにする理由**: 今は「辞書引き＋定型文＋`seedHash`」だけ。四柱推命×インド×宿曜×MBTI×職業を **横断統合して人生戦略に翻訳** する推論ができない＝ここがLLMの本領。

### 1-2. プロバイダ非依存（本書の主眼）
- アプリ（ブラウザ側）は **`/api/fortune` という1つの自前エンドポイントしか知らない**。
- どのLLM社を使うかは **サーバー側の env (`LLM_PROVIDER`) だけで切替**。アプリ側コードは無変更。
- → Gemini ↔ OpenAI ↔ Claude をコスト・日本語品質で**A/Bして本採用**できる。

```
[② 計算層(ローカル)] ──calculated(JSON)──▶ [/api/fortune] ──callLLM()──▶ [adapter] ──▶ Gemini / OpenAI / Claude
        ▲                                        │                                         (env で選択)
   profile(最小限)                          鑑定文(JSON/stream)
                                                 ▼
                                    [④ 描画層] ＋ フォールバック(③の既存テンプレ)
```

---

## 2. プロバイダ抽象化アーキテクチャ（切替の心臓部）

### 2-1. 共通インターフェース
`/api/fortune` は、プロバイダ差を吸収した1つの関数だけを呼ぶ。

```ts
// 入出力はプロバイダに依存しない（アプリ側の契約はここだけ）
callLLM({
  system,        // システムプロンプト（占術知識＋規約）
  user,          // ユーザーデータ（layer/tier/date/profile/calculated）
  schema,        // 期待するJSONスキーマ（構造化出力）
  stream,        // true=逐次返却
  tier,          // free/shot/basic/premium → モデル選択に使用
}) => { summary, score, sections[], meta }   // ★常に同じ形で返す
```

### 2-2. アダプタ層（プロバイダごとの実装をここに隔離）
```
api/
 ├─ fortune.js          # エンドポイント本体（検証・キャッシュ・callLLM呼び出し）
 ├─ llm/
 │   ├─ index.js        # callLLM(): env の LLM_PROVIDER で下記を振り分け
 │   ├─ gemini.js       # generateContent + responseSchema + context caching
 │   ├─ openai.js       # responses/chat.completions + response_format(json_schema)
 │   └─ claude.js       # messages + structured output(tool use) + cache_control
```

### 2-3. env による切替
```bash
LLM_PROVIDER=gemini            # gemini | openai | claude
GEMINI_API_KEY=...
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
# ティア→モデルの対応表（プロバイダ別。§5参照）も env or 設定ファイルで持つ
```
→ **`LLM_PROVIDER` を書き換えてデプロイし直すだけ**でプロバイダ総入れ替え。

---

## 3. どこで API を呼ぶか（ページ／ティア別）

ティア構成は `monetization-design.md`（FREE / SHOT¥100 / BASIC¥300 / PREMIUM¥500）に準拠。
**「ティア（用途）」で抽象化**し、各ティアに各社のモデルを割り当てる（§5の対応表）。

| ページ | レイヤー | AIの役割 | 形態 | ティア |
|--------|---------|---------|------|--------|
| `xten/today.html` | HACK（本日） | 当日エネルギーから「**今日のTODO/行動指針**」 | one-shot | 安・高頻度 |
| `xten/astrology.html` | CORE（基本構成） | 四柱×インド×宿曜×MBTI 統合の「**人物像・強み弱み・戦略**」 | one-shot | 中 |
| `xten/month.html` ※非表示 | FLOW（月間） | 月間カレンダーの解説・勝負日の根拠 | one-shot | 中 |
| `xten/year.html` ※非表示 | FLOW（年間） | 1〜3年の戦略ロードマップ | one-shot | 高 |
| （PREMIUM） | AI対話 / Sync Log | 記録→運勢再計算・次の一手 | multi-turn | 高 |

### 呼び出しポイント（実装位置）
- **today**: `js/today.js` の `calcTendency` 直後。計算済み `{ shukuyoRelation, dayStem, sixGroups, lagnaShort, … }` を `fetch('/api/fortune')`。
- **astrology**: `js/astrology.js` の計算集約後、`analyze*` の戻り値を **API応答で差し替え**。
- AI到着まで既存テンプレ（③）を即時表示 → 差し替え or ストリーミング。

---

## 4. エンドポイント I/O（アプリ側の契約 = プロバイダ不変）

### 4-1. リクエスト
```jsonc
POST /api/fortune
{
  "layer": "hack",                 // hack | core | flow_month | flow_year
  "tier":  "shot",                 // free | shot | basic | premium
  "date":  "2026-06-08",           // キャッシュキー／再現性のため必須
  "profile": {                     // ★PII最小化: nickname/email は送らない
    "mbti": "INTJ", "job": "エンジニア", "blood": "A", "birthYearOnly": 1995
  },
  "calculated": {                  // ②計算層の出力（決定論的）
    "fourPillars": { "dayStem": "庚", "element": "金", "yinYang": "陽", "season": "秋" },
    "vedic": { "lagna": "射手座", "nakshatra": "アシュヴィニー", "atmakaraka": "金星", "dasha": "木星期" },
    "shukuyo": { "main": "鬼宿", "sixGroups": "栄達", "sevenLuminary": "水曜",
                 "todayRelation": { "type": "栄", "level": "best" } }
  }
}
```

### 4-2. レスポンス（構造化出力 — 描画安定のため自由文にしない）
```jsonc
{
  "summary": "今日は『栄』の最良日。攻めの一手が通る。",
  "score": 87,
  "sections": [
    { "key": "nature",  "title": "今日のあなた", "body": "..." },
    { "key": "action",  "title": "今日のTODO",   "items": ["朝一でキーマンに連絡", "..."] },
    { "key": "timing",  "title": "勝負の時間帯", "body": "15-17時" },
    { "key": "caution", "title": "注意点",       "body": "..." }
  ],
  "meta": { "provider": "gemini", "model": "gemini-2.5-flash-lite", "cached": false }
}
```
> このスキーマは **どのプロバイダでも同一**。各アダプタが自社の構造化出力機能で必ずこの形に整形して返す。

---

## 5. プロバイダ比較（価格・機能・モデル割当）

> ⚠️ 価格・モデル名は 2026年6月時点のWeb調査値（一部集計サイト由来）。**契約前に各社公式の料金ページで要確認**。

### 5-1. 最安モデルの価格（100万トークンあたり）
| プロバイダ | 最安モデル | 入力 | 出力 | 割引 |
|-----------|-----------|------|------|------|
| **Gemini** | 2.5 Flash-Lite | **$0.10** | **$0.40** | Batch $0.05/$0.20、キャッシュ読込=入力の10% |
| **OpenAI** | GPT-4.1 nano | **$0.10** | **$0.40** | Batch 50%オフ |
| **Claude** | Haiku 4.5 | $1.00 | $5.00 | Batch $0.50/$2.50、prompt cache −90% |

- **最安は Gemini 2.5 Flash-Lite ≒ GPT-4.1 nano（同額）**。Claude Haiku はその約10倍。
- today 1回（入力2k＋出力0.6k）の概算: 最安2社 ≈ **約0.07円/回**、Claude Haiku ≈ 約0.75円/回。

### 5-2. ティア → 各社モデル割当（設定表）
| ティア(用途) | Gemini | OpenAI | Claude |
|-------------|--------|--------|--------|
| 安・高頻度（today / 無料層） | 2.5 Flash-Lite | GPT-4.1 nano | Haiku 4.5 |
| 中（基本構成 / 月間） | Flash（2.5/3） | GPT-4.1 mini / GPT-5.x mini | Sonnet 4.6 |
| 高（年間 / PREMIUM対話） | Pro（3.1 Pro 等） | GPT-5.x | Opus 4.8 |

### 5-3. 機能対応（アダプタが吸収する差分）
| 機能 | Gemini | OpenAI | Claude |
|------|--------|--------|--------|
| 構造化出力 | `responseSchema` + `responseMimeType:application/json` | `response_format: json_schema` | tool use / structured output |
| ストリーミング | `streamGenerateContent` | `stream: true` | `stream` |
| プロンプトキャッシュ | context caching（明示生成＋TTL） | prompt caching（自動/明示） | `cache_control` |
| 認証 | Google AI Studio キー / Vertex AI | OpenAI APIキー | Anthropic APIキー |

> 推奨初期構成: **コスト最優先なら Gemini 2.5 Flash-Lite**。`callLLM` 抽象化済みなので、OpenAI/Claude へは env 切替で即比較できる。

---

## 6. システムプロンプト設計（プロバイダ共通）

System Prompt は **静的な大ブロック**（占術知識＋出力規約＋トーン）。各社のキャッシュ機能でコスト削減（§5-3）。

```
[役割] x-TEN の命術解析エンジン。四柱推命・インド占星術・宿曜を統合し、
       「運命を10倍速で攻略する」実行可能な戦略に翻訳する軍師。
[占術知識ベース] ← 大きく静的＝キャッシュ対象
  四柱推命(五行/日干/通変星) / インド(ラグナ/ナクシャトラ/アトマカラカ/ダシャー) / 宿曜(27宿/六大類/七曜/9関係)
[統合ルール] 占術が矛盾する場合の優先順位と解消（例: 宿曜が吉でも四柱が単独行動吉なら「1対1で攻めよ」）。
            観測された計算値だけを根拠にし、値を捏造しない。
[出力規約] 指定スキーマで返す / tier=free は要約のみ・shot以上で全セクション /
          不安を煽らない・医療/投資/法務の断定禁止（免責）/ トーンは戦略的・前向き・具体的。
[ユーザーデータ] ← 毎回変わる（非キャッシュ）: layer/tier/date/profile/calculated（§4-1）
```

---

## 7. 技術詳細

### 7-1. 結果キャッシュ（プロバイダ非依存・コスト＆再現性）
- キー = `hash(layer + tier + date + calculated)`。
- **同じ人の同じ日の結果は不変**であるべき → リロードで再課金しない。
- **2層構成**:
  - ① クライアント（localStorage）= **実装済み**（`js/api-client.js`）。ブラウザ内でその日の結果を再利用。前日以前は自動破棄。
  - ② サーバー（Vercel KV / Cloudflare KV）= 本番向けTODO。ユーザー横断・デバイス横断で共有しさらに削減。
- TTL: hack=当日 / core=長め。

### 7-2. プロンプトキャッシュ
- 占術知識の長いSystem Promptは全ユーザー共通＝各社のキャッシュ機能でコスト大幅減（§5-3）。
- 注意: **キャッシュの作法が社ごとに違う**ため、アダプタ内で実装（Geminiは明示生成＋TTL、Claudeは`cache_control`、OpenAIは自動/明示）。

### 7-3. ストリーミング
- today（短文）: 一括でよい（結果キャッシュ前提）。
- core/year（長文）: SSEで逐次表示 → 体感速度↑。アダプタが各社のストリームを共通形式に正規化。

### 7-4. フォールバック（既存テンプレを残す理由）
- API障害・予算上限・タイムアウト時は **既存 `analyze*` テンプレ（③）に自動退避**。
- → 既存の解釈テンプレ関数は **削除せず温存**（縮退運転の安全網）。

### 7-5. セキュリティ / プライバシー
- 各社APIキーはサーバ環境変数のみ（`.gitignore` の `.env`）。クライアント・リポジトリに置かない。
- **PII最小化**: nickname/email/正確な出生時刻はモデルに渡さない。計算済み天文値＋属性のみ。
- レート制限（IP/ユーザー単位の1日上限）でコスト暴発・乱用を防止。
- 免責（医療/投資/法務の断定禁止）をプロンプトとUIに明記。

---

## 8. 段階導入プラン

| Phase | 内容 |
|-------|------|
| **P0** | `/api/fortune` ＋ **`callLLM` 抽象化層**を構築。アダプタは Gemini を最初に実装（最安） |
| **P1** | `today` を Gemini 2.5 Flash-Lite でAI化。結果キャッシュ＋テンプレフォールバック |
| **P2** | OpenAI / Claude アダプタを追加 → **env切替でA/B**（日本語品質・コスト比較）して本採用を決定 |
| **P3** | `astrology`(core) をAI化（構造化出力＋ストリーミング） |
| **P4** | `month` / `year` をAI化（非表示タブを再公開） |
| **P5** | PREMIUM の AI対話 / Sync Log（multi-turn）。キャッシュ最適化・コスト監視 |

---

## 9. まとめ（一言で）

> **「占いの数学はローカル、占いの言葉はAI。AI社は env で差し替え可能」**
> 計算層(`calc*`)はそのまま。解釈層(`analyze*`/`calcTendency`)を `/api/fortune` 経由で生成し、
> 内部は `callLLM` 抽象化＋アダプタで **Gemini / OpenAI / Claude を切替**。
> 初期は最安の **Gemini 2.5 Flash-Lite**、結果キャッシュ・プロンプトキャッシュ・テンプレフォールバックでコストと信頼性を担保する。

---

### 参考（2026年6月時点・要公式確認）
- Gemini 公式料金: https://ai.google.dev/gemini-api/docs/pricing
- OpenAI 公式料金: https://openai.com/api/pricing/
- Claude 公式料金: https://platform.claude.com/docs/en/about-claude/pricing
