// ======================================================
// システムプロンプト / ユーザープロンプト / 出力スキーマ
// プロバイダ非依存（gemini/openai/claude いずれのアダプタからも使う）
// ======================================================

// 解釈層ごとに「sections の key」を固定する。
// today(hack) は描画側の DOM (astro-overall 等) に合わせて key を厳守させる。
const SECTION_KEYS = {
  hack:       ['overall', 'career', 'love', 'money', 'health'],
  core:       ['nature', 'strength', 'weakness', 'strategy'],
  flow_month: ['summary', 'attack_days', 'caution_days', 'advice'],
  flow_year:  ['theme', 'roadmap', 'turning_point', 'advice']
};

// 構造化出力スキーマ（Gemini responseSchema / Claude tool input_schema で使用）
export const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: '全体を1〜2文で要約' },
    score:   { type: 'integer', description: '本日/対象の運勢スコア 0-100' },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key:   { type: 'string', description: '指定されたキーのいずれか' },
          title: { type: 'string', description: '見出し（日本語）' },
          body:  { type: 'string', description: '鑑定文（日本語・2〜4文）' }
        },
        required: ['key', 'title', 'body']
      }
    }
  },
  required: ['summary', 'sections']
};

// ティア × プロバイダ → モデル（P0 は各社1モデル。将来ティアで段階化）
const DEFAULT_MODEL = {
  gemini: () => process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite',
  openai: () => process.env.OPENAI_MODEL || 'gpt-4.1-nano',
  claude: () => process.env.CLAUDE_MODEL || 'claude-haiku-4-5'
};
export function pickModel(provider /*, tier */) {
  return (DEFAULT_MODEL[provider] || DEFAULT_MODEL.gemini)();
}

export function buildSystemPrompt() {
  return `[役割]
あなたは「x-TEN（エクステン）」の命術解析エンジンです。四柱推命・インド占星術・宿曜占星術を統合し、「運命を10倍速で攻略する」ための実行可能な戦略に翻訳する軍師として振る舞います。

[占術知識ベース]
- 四柱推命: 五行（木=成長/柔軟、火=情熱/表現、土=安定/信頼、金=判断/精度、水=知性/適応）と日干・陰陽でその人の本質と当日のエネルギーを読む。
- インド占星術: ラグナ（第一印象）、ナクシャトラ（内面の感性）、アトマカラカ（魂のテーマ）、ダシャー（惑星期）で人生の骨組みを読む。
- 宿曜占星術: 27宿・六大類・七曜、および本命宿と本日の宿の「関係」(栄=最良/親=縁/友=対等/安=安定/壊・衰・危=守り/命・業・胎=節目)で日々の運勢と相性を読む。

[統合ルール]
- 与えられた calculated（計算済みの値）だけを根拠にし、値を捏造しない。
- 占術が示す方向が矛盾する場合は優先順位をつけて1つの具体的行動に落とす（例: 宿曜が吉でも四柱が単独行動吉なら「大人数ではなくキーマン1人と1対1で会え」）。
- profile（MBTI/職業）を踏まえ、その人の文脈に翻訳する。

[出力規約]
- 必ず JSON のみを出力する（前後に説明文を付けない）。
- スキーマ: { "summary": string, "score": integer(0-100), "sections": [{ "key": string, "title": string, "body": string }] }
- sections の key は layer ごとに以下を厳守する:
  - hack: overall（総合）, career（仕事）, love（対人・恋愛）, money（金運）, health（健康）
  - core: nature（本質）, strength（強み）, weakness（弱み）, strategy（人生戦略）
  - flow_month: summary, attack_days, caution_days, advice
  - flow_year: theme, roadmap, turning_point, advice
- tier=free は各 body を1〜2文に簡潔化。shot 以上は2〜4文で具体的に。
- トーンは戦略的・前向き・具体的（精神論で終わらせない）。不安を煽らない。
- 医療・投資・法務に関する断定は禁止（一般的助言にとどめ、必要なら専門家相談を促す）。`;
}

export function buildUserPrompt({ layer, tier, date, profile, calculated }) {
  const keys = SECTION_KEYS[layer] || SECTION_KEYS.hack;
  return `以下はある人物の命術計算結果です。これを解釈し、システム規約のJSONスキーマで鑑定文を生成してください。

layer: ${layer}
tier: ${tier || 'free'}
date: ${date || ''}
このlayerで必須の sections.key: ${JSON.stringify(keys)}

profile（PIIは含まない）:
${JSON.stringify(profile || {}, null, 2)}

calculated（計算済み・決定論的な値。これだけを根拠にすること）:
${JSON.stringify(calculated || {}, null, 2)}

出力はJSONのみ。`;
}
