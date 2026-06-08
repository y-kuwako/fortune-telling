# /api — 占い解釈生成バックエンド

`docs/ai-api-design.md` の実装。占いの「計算」はブラウザ側（`js/*.js` の `calc*`）で行い、
「解釈文の生成」だけをこの API 経由で LLM に任せる。プロバイダは env で切替可能。

## 構成
```
api/
 ├─ fortune.js            # /api/fortune エンドポイント（検証→プロンプト→callLLM→JSON返却）
 └─ _lib/                 # 先頭 _ のためVercelはルート化しない（ヘルパー扱い）
     ├─ prompt.js         # システム/ユーザープロンプト＋出力スキーマ＋モデル選択
     └─ llm/
         ├─ index.js      # callLLM(): env LLM_PROVIDER で振り分け
         ├─ gemini.js     # generateContent + responseSchema
         ├─ openai.js     # chat.completions + JSONモード
         └─ claude.js     # messages + tool use
```

## セットアップ（Vercel 想定）
1. このリポジトリを Vercel にインポート（フレームワークなし／静的サイト＋関数を自動検出）。
2. Vercel の **Environment Variables** に設定（`.env.example` 参照）:
   - `LLM_PROVIDER` = `gemini`（推奨・最安）/ `openai` / `claude`
   - 対応するキー: `GEMINI_API_KEY` など
3. デプロイ。`https://<your-app>/api/fortune` が有効になる。

ローカル確認は `vercel dev`（Vercel CLI）を使う。`.env` にキーを入れておく（`.env` は `.gitignore` 済み）。

## プロバイダ切替
`LLM_PROVIDER` を変えて再デプロイするだけ。アプリ側（ブラウザのJS）の変更は不要。
デフォルトモデル: gemini=`gemini-2.5-flash-lite` / openai=`gpt-4.1-nano` / claude=`claude-haiku-4-5`
（`*_MODEL` env で上書き可。**モデル名・料金は契約前に各社公式で要確認**）

## リクエスト / レスポンス
- リクエスト: `{ layer, tier, date, profile, calculated }`（`docs/ai-api-design.md` §4-1）
- レスポンス: `{ summary, score, sections:[{key,title,body}], meta:{provider,model} }`
- 失敗時は 4xx/5xx を返し、フロントは既存テンプレ文へフォールバックする（サイトは動き続ける）。

## 実装済みの堅牢化
- **タイムアウト**: 各LLM呼び出しは既定12秒で中断（`_lib/http.js`）。ハング時は 502 → クライアントはテンプレへフォールバック。
- **出力トークン上限**: `MAX_OUTPUT_TOKENS=1500`（暴走コスト防止）。
- **入力検証**: `layer`/`tier` の列挙チェック、`calculated`/`profile` のサイズ上限。不正は 400。
- **エラー区別**: 入力不正=400、LLM失敗=502。
- **クライアント結果キャッシュ**（localStorage, `js/api-client.js`）: 同じ人の同じ日はAPIを再度叩かない。

## 未実装 / TODO
- サーバーKV結果キャッシュ: `hash(layer+tier+date+calculated)` をキーに横断的に再課金回避（ユーザー/デバイス横断）
- プロンプトキャッシュ（各社のキャッシュ機能でSystem Prompt分を削減）
- レート制限（IP/ユーザー単位の頻度制限。serverless多重起動のため KV 等の共有ストアが必要）
