# AI / API 設計書 — 占いロジックのAI抽出

> 目的: 現在ハードコードされている「占いの解釈ロジック」を Claude API に置き換え、
> 計算結果から **個別最適化された自然言語の鑑定文** を生成する。
> 本書は「どこで・なぜ・どうやって API を使うか」を定義する。

---

## 1. 基本方針 — 「計算」と「解釈」を分離する

現在のコードはすでに2層に分かれている。AI化するのは **解釈層だけ** で、計算層はローカルに残す。

| 層 | 中身 | 例（実コード） | AI化 |
|----|------|----------------|------|
| **① 入力層** | プロフィール収集 | `index.html` のフォーム → `localStorage['xten.profile']` | ✕ そのまま |
| **② 計算層** | 暦・天文の決定論的計算 | `calcDayPillar` / `calcLagna` / `calcShukuyo` / `calcAtmakaraka` / `calcDasha`（`js/astrology.js`, `js/today.js`） | ✕ **ローカル維持** |
| **③ 解釈層** ★ | 計算結果 → 鑑定文 | `analyzeFourPillars` / `analyzeVedic` / `analyzeShukuyo` / `analyzeBasic` / `calcTendency` | ◎ **AIに置換** |
| **④ 描画層** | HTML生成 | 各JSの render 部 | △ 構造はそのまま、文章だけAI由来に |

### なぜ計算層をAIにしないのか
- **決定論的**: 生年月日 → 日柱・ラグナ・宿曜は数学。LLMにやらせると誤り・揺れが出る。
- **無料・高速・オフライン**: 既存の `calc*` は0円・即時。
- **再現性**: 同じ生年月日なら毎回同じ天文値であるべき（占いの信頼性の根拠）。

### なぜ解釈層をAIにするのか（＝ユーザーの狙い）
現在の解釈は **辞書引き＋テンプレート文字列＋`seedHash` の擬似ランダム**（`js/astrology.js:373-501`, `js/today.js:137-221`）。
- 例: `analyzeFourPillars` は `E = {木:{keyword:...}, 火:{...}}` の固定辞書を引いて文を組むだけ。
- 複数占術（四柱推命×インド×宿曜×MBTI×職業）を **横断して統合・矛盾解消・人生戦略に翻訳** する推論ができない。
- → ここが LLM の本領。**計算結果を入力に、統合鑑定文を生成** させる。

```
[② 計算層(ローカル)]  ──calculated(JSON)──▶  [/api/fortune (サーバーレス)]  ──▶  Claude API
        ▲                                              │
        │                                       鑑定文(JSON/stream)
   profile(最小限)                                      ▼
                                            [④ 描画層] ＋ フォールバック(③の既存テンプレ)
```

---

## 2. どこで API を呼ぶか（ページ／ティア別）

ティア構成は `monetization-design.md`（FREE / SHOT¥100 / BASIC¥300 / PREMIUM¥500）に準拠。
**コスト最適化のため、ティアとモデルを段階的に対応させる。**

| ページ | レイヤー | AIの役割 | 呼出形態 | 推奨モデル | ティア |
|--------|---------|---------|---------|-----------|--------|
| `xten/today.html` | HACK（本日） | 宿曜関係＋四柱の当日エネルギーから「**今日のTODO/行動指針**」を生成 | one-shot | **Haiku 4.5** | FREEは一言 / SHOT+でフル |
| `xten/astrology.html` | CORE（基本構成） | 四柱×インド×宿曜×MBTIを統合した「**人物像・強み弱み・人生戦略**」 | one-shot | **Sonnet 4.6** | SHOT+ |
| `xten/month.html` ※現在非表示 | FLOW（月間） | 月間エネルギーカレンダーの解説・勝負日の根拠 | one-shot | Sonnet 4.6 | BASIC+ |
| `xten/year.html` ※現在非表示 | FLOW（年間） | 1〜3年の戦略ロードマップ（ダシャー×大運） | one-shot | **Opus 4.8** or Sonnet | PREMIUM |
| （PREMIUM機能） | AI対話 / Sync Log | 「今月やったこと」記録 → 運勢シナリオ再計算・次の一手提案 | **multi-turn** | Sonnet 4.6 | PREMIUM |

### 呼び出しポイントの実装位置
- **today**: `js/today.js` の `calcTendency` 直後。計算済み `{ shukuyoRelation, dayStem, sixGroups, lagnaShort, emotion, personality }` を `/api/fortune` に渡す。
- **astrology**: `js/astrology.js` の計算結果集約後（`analyzeBasic`/`analyzeFourPillars` 等を呼ぶ直前）。これらの関数の戻り値を **API応答で差し替える**。
- AI応答が来るまでは既存テンプレ（③）を即時表示 → AI到着で差し替え or ストリーミング、のどちらか（§5.4）。

---

## 3. API エンドポイント設計

### 3.1 構成 — 必ずサーバーレス経由（鍵をクライアントに出さない）

```
Browser (計算済みJSON)
   │  POST /api/fortune
   ▼
Serverless Function (Cloudflare Workers / Vercel Edge)
   │  ・ANTHROPIC_API_KEY は環境変数（クライアント露出ゼロ）
   │  ・入力検証 / レート制限 / キャッシュ参照
   ▼
Claude API (Messages, prompt caching, streaming)
```

> 旧 `api/fortune.js`（削除済み）が同じ役割だった。これを再構築する。

### 3.2 リクエスト

```jsonc
POST /api/fortune
{
  "layer": "hack",                 // hack | core | flow_month | flow_year
  "tier":  "shot",                 // free | shot | basic | premium（出力の深さ/分量制御）
  "date":  "2026-06-08",           // 当日（キャッシュキー／再現性のため必須）
  "profile": {                     // ★PII最小化: nickname/email は送らない
    "mbti": "INTJ",
    "job":  "エンジニア",
    "blood": "A",
    "birthYearOnly": 1995          // 年代テーマ用。月日時はサーバ側で計算済みなら送らない
  },
  "calculated": {                  // ②計算層の出力（決定論的）
    "fourPillars": { "dayStem": "庚", "element": "金", "yinYang": "陽", "season": "秋" },
    "vedic": { "lagna": "射手座", "nakshatra": "アシュヴィニー", "atmakaraka": "金星", "dasha": "木星期" },
    "shukuyo": { "main": "鬼宿", "sixGroups": "栄達", "sevenLuminary": "水曜",
                 "todayRelation": { "type": "栄", "level": "best" } }
  }
}
```

### 3.3 レスポンス — 構造化出力（Tool use / structured output）

描画を安定させるため、自由文ではなく **セクション化したJSON** を返す（Claude の structured output / tool use で強制）。

```jsonc
{
  "summary": "今日は『栄』の最良日。攻めの一手が通る。",
  "score": 87,
  "sections": [
    { "key": "nature",   "title": "今日のあなた", "body": "..." },
    { "key": "action",   "title": "今日のTODO",   "items": ["朝一でキーマンに連絡", "..."] },
    { "key": "timing",   "title": "勝負の時間帯", "body": "15-17時" },
    { "key": "caution",  "title": "注意点",       "body": "..." }
  ],
  "meta": { "model": "claude-haiku-4-5", "cached": false, "tokens": { "in": 1840, "out": 520 } }
}
```

---

## 4. システムプロンプト設計

System Prompt は **静的な大ブロック**（占術知識＋出力規約＋トーン）にし、**Prompt Caching でキャッシュ**する（§5.1）。
ユーザー固有データは user メッセージ側に置く。

```
[役割]
あなたは x-TEN の命術解析エンジン。四柱推命・インド占星術・宿曜占星術を統合し、
「運命を10倍速で攻略する」ための実行可能な戦略に翻訳する軍師である。

[占術知識ベース]   ← 大きく静的 → キャッシュ対象
- 四柱推命: 五行(木火土金水)・日干・通変星の意味…
- インド占星術: ラグナ・ナクシャトラ・アトマカラカ・ダシャーの意味…
- 宿曜: 27宿・六大類・七曜・9つの関係(栄親友/壊衰危/命業胎)の意味…

[統合ルール]
- 占術が矛盾する場合の優先順位と解消方法（例: 宿曜が吉でも四柱が単独行動吉なら「1対1で攻めよ」）。
- 必ず "観測された計算値" だけを根拠にし、値を捏造しない。

[出力規約]
- 指定の structured output スキーマで返す。
- tier=free は要約＋一言のみ。shot 以上で全セクション。
- 占い特有の断定で不安を煽らない。健康・医療・投資の断定は禁止（免責）。
- トーン: 戦略的・前向き・具体的（精神論で終わらせない）。

[ユーザーデータ]  ← user メッセージ（毎回変わる、非キャッシュ）
layer / tier / date / profile / calculated（§3.2のJSON）
```

---

## 5. 技術詳細

### 5.1 Prompt Caching（最重要のコスト施策）
- System Prompt（占術知識＋規約）は全ユーザー共通・静的 → `cache_control` でキャッシュ。
- 効果: 2回目以降の入力トークンが大幅割引。占いは同一プロンプトを高頻度で叩くため効果絶大。

### 5.2 結果キャッシュ（コスト＋再現性）
- キー = `hash(layer + tier + date + calculated)`。
- **同じ人の同じ日の結果は不変であるべき** → KV（Cloudflare KV / Vercel KV）に保存し、リロード時は再課金しない。
- TTL: hack=当日いっぱい / core=長め（基本構成は日替りしない）。

### 5.3 モデル選定とコスト感
| 用途 | モデル | 理由 |
|------|--------|------|
| 日次(today)・高頻度・無料層 | **Haiku 4.5** | 最安・最速。1日数万回でも耐える |
| 基本構成・月間（有料） | **Sonnet 4.6** | 統合推論の質 |
| 年間戦略・PREMIUM対話 | **Opus 4.8 / Sonnet 4.6** | 長期×多占術の最深解析 |

> 概算: today 1回 ≒ 入力2k+出力0.6k トークン。Haiku＋キャッシュ＋結果キャッシュで
> 「1ユーザー1日1回」課金は実質ごくわずか。詳細単価は実装時に最新の料金表で確定。

### 5.4 ストリーミング vs 一括
- **today（無料・短文）**: 一括でよい（結果キャッシュ前提）。
- **core/year（長文）**: SSE ストリーミングでセクションを順次表示 → 体感速度↑（既存の「10秒ローディング演出」を置換可能）。

### 5.5 フォールバック（既存テンプレを残す理由）
- API障害・予算上限・タイムアウト時は **既存 `analyze*` テンプレ（③）にフォールバック**。
- → 既存の解釈テンプレ関数は **削除せず温存** する（縮退運転用の安全網）。
- UI: AI到着前にテンプレを即描画 → 来たら差し替える、でも可（体感ゼロ秒）。

### 5.6 セキュリティ / プライバシー
- `ANTHROPIC_API_KEY` はサーバ環境変数のみ。クライアント・リポジトリに置かない（`.gitignore` の `.env` 済み）。
- **PII最小化**: nickname / email / 正確な出生時刻はモデルに渡さない。計算済みの天文値＋属性のみ送る。
- レート制限（IP/ユーザー単位の1日上限）で乱用・コスト暴発を防止。
- 免責: 医療・投資・法務の断定を禁止する旨をプロンプトとUIに明記。

---

## 6. 段階導入プラン

| Phase | 内容 | 対象 |
|-------|------|------|
| **P1** | `/api/fortune` 復活（サーバーレス＋鍵管理）。`today` を Haiku でAI化。結果キャッシュ＋テンプレフォールバック | FREE/SHOT 体験の核 |
| **P2** | `astrology`(core) を Sonnet でAI化。structured output＋ストリーミング | SHOT 転換率向上 |
| **P3** | `month` / `year` をAI化（非表示タブを再公開） | BASIC/PREMIUM |
| **P4** | PREMIUM の **AI対話タスク管理 / Sync Log**（multi-turn・会話文脈保持） | PREMIUM LTV |
| **P5** | Prompt Caching 最適化・コスト監視・A/B（テンプレ vs AI の的中体感） | 全体 |

---

## 7. まとめ（一言で）

> **「占いの数学はローカルで、占いの言葉はAIで」**
> 計算層(`calc*`)はそのまま。解釈層(`analyze*`/`calcTendency`)を `/api/fortune` 経由の Claude API に置換し、
> Prompt Caching・結果キャッシュ・テンプレフォールバックでコストと信頼性を担保する。
