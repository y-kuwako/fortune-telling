// ========================================
// Four Pillars × Indian Astrology - x-TEN
// ========================================

// --- 四柱推命: 天干・地支 ---
const HEAVENLY_STEMS = [
  { name: "甲", element: "木", yin_yang: "陽", trait: "大木のように真っ直ぐで正義感が強い" },
  { name: "乙", element: "木", yin_yang: "陰", trait: "草花のようにしなやかで適応力がある" },
  { name: "丙", element: "火", yin_yang: "陽", trait: "太陽のように明るく情熱的" },
  { name: "丁", element: "火", yin_yang: "陰", trait: "灯火のように繊細で知性的" },
  { name: "戊", element: "土", yin_yang: "陽", trait: "山のように堂々として安定感がある" },
  { name: "己", element: "土", yin_yang: "陰", trait: "田畑のように温かく育む力がある" },
  { name: "庚", element: "金", yin_yang: "陽", trait: "鉄のように強靭で決断力がある" },
  { name: "辛", element: "金", yin_yang: "陰", trait: "宝石のように美しく繊細" },
  { name: "壬", element: "水", yin_yang: "陽", trait: "大海のように器が大きく自由" },
  { name: "癸", element: "水", yin_yang: "陰", trait: "雨露のように優しく浄化する力がある" }
];

const EARTHLY_BRANCHES = [
  { name: "子", animal: "鼠", element: "水" },
  { name: "丑", animal: "牛", element: "土" },
  { name: "寅", animal: "虎", element: "木" },
  { name: "卯", animal: "兎", element: "木" },
  { name: "辰", animal: "龍", element: "土" },
  { name: "巳", animal: "蛇", element: "火" },
  { name: "午", animal: "馬", element: "火" },
  { name: "未", animal: "羊", element: "土" },
  { name: "申", animal: "猿", element: "金" },
  { name: "酉", animal: "鶏", element: "金" },
  { name: "戌", animal: "犬", element: "土" },
  { name: "亥", animal: "猪", element: "水" }
];

const FIVE_ELEMENTS = {
  "木": { color: "グリーン", season: "春", direction: "東", organ: "肝", emotion: "怒", symbol: "🌿" },
  "火": { color: "レッド", season: "夏", direction: "南", organ: "心", emotion: "喜", symbol: "🔥" },
  "土": { color: "イエロー", season: "土用", direction: "中央", organ: "脾", emotion: "思", symbol: "🏔️" },
  "金": { color: "ホワイト", season: "秋", direction: "西", organ: "肺", emotion: "悲", symbol: "⚔️" },
  "水": { color: "ブルー", season: "冬", direction: "北", organ: "腎", emotion: "恐", symbol: "💧" }
};

// --- インド占星術: ナクシャトラ(27宿) ---
const NAKSHATRAS = [
  { name: "アシュヴィニー", deity: "アシュヴィン双神", symbol: "🐴", trait: "治癒力と迅速な行動力に恵まれています", quality: "活動的・冒険好き" },
  { name: "バラニー", deity: "ヤマ", symbol: "🐘", trait: "強い意志と変容の力を持っています", quality: "忍耐強い・献身的" },
  { name: "クリッティカー", deity: "アグニ", symbol: "🔥", trait: "鋭い知性と浄化の力を持っています", quality: "鋭敏・リーダー気質" },
  { name: "ローヒニー", deity: "ブラフマー", symbol: "🌹", trait: "創造性と美的感覚に優れています", quality: "魅力的・芸術的" },
  { name: "ムリガシーラ", deity: "ソーマ", symbol: "🦌", trait: "探究心と繊細な感性の持ち主です", quality: "探究的・知的好奇心" },
  { name: "アールドラー", deity: "ルドラ", symbol: "💎", trait: "変革と再生の力を秘めています", quality: "情熱的・変革者" },
  { name: "プナルヴァス", deity: "アディティ", symbol: "🏹", trait: "再生と回復の力に恵まれています", quality: "楽観的・寛大" },
  { name: "プシュヤ", deity: "ブリハスパティ", symbol: "🌸", trait: "養育と保護の力を持っています", quality: "慈悲深い・教育的" },
  { name: "アーシュレーシャ", deity: "ナーガ", symbol: "🐍", trait: "深い知恵と神秘的な直感があります", quality: "洞察力・神秘的" },
  { name: "マガー", deity: "ピトリ", symbol: "👑", trait: "王者の風格と権威を持っています", quality: "高貴・伝統重視" },
  { name: "プールヴァ・パルグニー", deity: "バガ", symbol: "🎭", trait: "芸術的才能と享楽の才があります", quality: "創造的・社交的" },
  { name: "ウッタラ・パルグニー", deity: "アリヤマン", symbol: "🤝", trait: "友情と契約の力に恵まれています", quality: "誠実・協力的" },
  { name: "ハスタ", deity: "サヴィトリ", symbol: "✋", trait: "巧みな技術と実行力があります", quality: "器用・実践的" },
  { name: "チトラー", deity: "トヴァシュトリ", symbol: "💫", trait: "美と創造のエネルギーに満ちています", quality: "魅力的・独創的" },
  { name: "スヴァーティー", deity: "ヴァーユ", symbol: "🍃", trait: "自由と独立の精神に溢れています", quality: "独立心・柔軟" },
  { name: "ヴィシャーカー", deity: "インドラ・アグニ", symbol: "🌳", trait: "強い目的意識と達成力があります", quality: "決意・集中力" },
  { name: "アヌラーダー", deity: "ミトラ", symbol: "🌺", trait: "友愛と献身の力を持っています", quality: "親しみやすい・献身的" },
  { name: "ジェーシュター", deity: "インドラ", symbol: "⭐", trait: "守護とリーダーシップの力があります", quality: "保護的・責任感" },
  { name: "ムーラ", deity: "ニルリティ", symbol: "🌿", trait: "根源的な真理を探究する力があります", quality: "探究的・根本的" },
  { name: "プールヴァ・アシャーダー", deity: "アパス", symbol: "🌊", trait: "不敗のエネルギーと浄化力があります", quality: "自信・活力" },
  { name: "ウッタラ・アシャーダー", deity: "ヴィシュヴェーデーヴァ", symbol: "🏔️", trait: "最終的な勝利と普遍的な力を持っています", quality: "リーダー・普遍的" },
  { name: "シュラヴァナ", deity: "ヴィシュヌ", symbol: "👂", trait: "傾聴力と学びの力に優れています", quality: "学習力・広い視野" },
  { name: "ダニシュター", deity: "ヴァス", symbol: "🥁", trait: "富と名声を引き寄せる力があります", quality: "野心的・音楽的" },
  { name: "シャタビシャ", deity: "ヴァルナ", symbol: "💧", trait: "癒しと秘密の知識を持っています", quality: "癒し・神秘的" },
  { name: "プールヴァ・バードラパダー", deity: "アジャ・エーカパード", symbol: "🔱", trait: "霊的な力と変容のエネルギーがあります", quality: "情熱的・理想主義" },
  { name: "ウッタラ・バードラパダー", deity: "アヒル・ブドニャ", symbol: "🐉", trait: "深い知恵と精神的安定を持っています", quality: "賢明・安定" },
  { name: "レーヴァティー", deity: "プーシャン", symbol: "🐟", trait: "養育と旅の守護を受けています", quality: "慈悲深い・直感的" }
];

// --- 西洋12星座 ---
function calcZodiacSign(month, day) {
  const cutoffs = [
    { month: 1,  day: 19, name: "山羊座" },
    { month: 2,  day: 18, name: "水瓶座" },
    { month: 3,  day: 20, name: "魚座"   },
    { month: 4,  day: 19, name: "牡羊座" },
    { month: 5,  day: 20, name: "牡牛座" },
    { month: 6,  day: 21, name: "双子座" },
    { month: 7,  day: 22, name: "蟹座"   },
    { month: 8,  day: 22, name: "獅子座" },
    { month: 9,  day: 22, name: "乙女座" },
    { month: 10, day: 23, name: "天秤座" },
    { month: 11, day: 22, name: "蠍座"   },
    { month: 12, day: 21, name: "射手座" }
  ];
  for (const c of cutoffs) {
    if (month < c.month || (month === c.month && day <= c.day)) {
      return c.name;
    }
  }
  return "山羊座"; // 12/22 - 12/31
}

// --- index.html の profile-form が localStorage に保存した値を読む ---
function loadStoredProfile() {
  try {
    const raw = localStorage.getItem('xten.profile');
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed || {};
  } catch { return {}; }
}

// 血液型ラベルの整形
function formatBloodType(blood) {
  if (!blood) return "未入力";
  // 「A」「A型」「a」などのバリアントに対応
  const s = String(blood).trim().toUpperCase();
  if (/^(A|B|AB|O)$/.test(s)) return `${s}型`;
  return s;
}

// --- 動物干支（漢字名） ---
const ANIMAL_NAMES = ['鼠','牛','虎','兎','龍','蛇','馬','羊','猿','鶏','犬','猪'];

// --- 傾向分析: 性格 6 軸 + 感情 18 種 ---
const PERSONALITY_DIMENSIONS = [
  { label: '関心', leftLabel: '外向性', rightLabel: '内向性' },
  { label: '姿勢', leftLabel: '積極性', rightLabel: '消極性' },
  { label: '目的', leftLabel: '接近性', rightLabel: '回避性' },
  { label: '行動', leftLabel: '能動性', rightLabel: '受動性' },
  { label: '思考', leftLabel: '楽観性', rightLabel: '悲観性' },
  { label: '器',   leftLabel: '受容性', rightLabel: '拒絶/抵抗性' }
];

const EMOTIONS_18 = [
  '興味/発見', '興奮/恍惚', '満足/歓喜', '悩み/葛藤', '疑問/混乱',
  '疑心/警戒', '妄想/空想', '不安/恐怖', '羞恥',     '怒り/憤慨',
  '悲しみ/落胆', '退屈',     '尊敬',       '軽蔑',     '畏怖',
  '親愛/感謝', '冷静',       '驚き'
];

// 入力文字列から決定論的な擬似ランダムを生成
function seedHash(input) {
  let h = 0;
  const s = String(input);
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function calcTendency(input) {
  const { profile, dayStem, monthBranch, lagna, nakshatra, sixGroups, mainShukuyo, shukuyoIdx } = input;
  const mbti = profile.mbti && /^[EI][NS][TF][JP]$/.test(String(profile.mbti).toUpperCase())
    ? String(profile.mbti).toUpperCase() : null;
  const lagnaShort = (lagna || '').replace('ラグナ', '').replace('座', '');
  const dayEl = dayStem.element;
  const dayYY = dayStem.yin_yang;
  const shukuyoEl = SHUKUYO_27[shukuyoIdx].element;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // --- 各システムが性格 6 軸に与える寄与テーブル ---
  const LAGNA_EI       = {'牡羊':+14,'牡牛':-6,'双子':+18,'蟹':-10,'獅子':+16,'乙女':-8,'天秤':+12,'蠍':-14,'射手':+15,'山羊':-6,'水瓶':+10,'魚':-10};
  const LAGNA_JP       = {'牡羊':+10,'牡牛':+4,'双子':-4,'蟹':-2,'獅子':+8,'乙女':+10,'天秤':0,'蠍':+6,'射手':-2,'山羊':+12,'水瓶':-6,'魚':-8};
  const LAGNA_NS       = {'牡羊':+8,'牡牛':-6,'双子':+10,'蟹':-2,'獅子':+6,'乙女':-8,'天秤':+2,'蠍':+4,'射手':+12,'山羊':-4,'水瓶':+14,'魚':+10};
  const LAGNA_ACT      = {'牡羊':+14,'牡牛':-4,'双子':+8,'蟹':-8,'獅子':+12,'乙女':-2,'天秤':+2,'蠍':+6,'射手':+10,'山羊':+6,'水瓶':+4,'魚':-10};
  const LAGNA_OPT      = {'牡羊':+10,'牡牛':+6,'双子':+8,'蟹':-6,'獅子':+12,'乙女':-4,'天秤':+8,'蠍':-10,'射手':+14,'山羊':-2,'水瓶':+10,'魚':+4};
  const LAGNA_RECP     = {'牡羊':-8,'牡牛':+10,'双子':-2,'蟹':+14,'獅子':-6,'乙女':+4,'天秤':+10,'蠍':-12,'射手':+2,'山羊':-4,'水瓶':-6,'魚':+14};

  const SIX_EI         = {'安住':-6,'破壊':+4,'栄達':+10,'親和':+8,'友好':+16,'危機':-4};
  const SIX_JP         = {'安住':-6,'破壊':+8,'栄達':+12,'親和':+4,'友好':+2,'危機':+6};
  const SIX_APP        = {'安住':-4,'破壊':+6,'栄達':+14,'親和':+6,'友好':+8,'危機':-10};
  const SIX_ACT        = {'安住':-12,'破壊':+14,'栄達':+12,'親和':+2,'友好':+6,'危機':+4};
  const SIX_OPT        = {'安住':+8,'破壊':-4,'栄達':+14,'親和':+10,'友好':+8,'危機':-12};
  const SIX_RECP       = {'安住':+10,'破壊':-10,'栄達':-2,'親和':+14,'友好':+12,'危機':-12};

  const EL_JP          = {'木':+4,'火':+10,'土':-4,'金':+8,'水':-8};
  const EL_APP         = {'木':+10,'火':+12,'土':-2,'金':-6,'水':-8};
  const EL_ACT         = {'木':+8,'火':+14,'土':-4,'金':+4,'水':-10};
  const EL_OPT         = {'木':+12,'火':+10,'土':+2,'金':-8,'水':-10};
  const EL_RECP        = {'木':+4,'火':-4,'土':+12,'金':-12,'水':+8};

  const SHUKUYO_EL_OPT = {'金':-4,'土':+4,'日':+10,'月':-4,'火':+4,'水':-6,'木':+12};

  // --- 6 軸を計算（基準 50、上下クランプ 12-88） ---
  // 関心: 外向性 vs 内向性
  let kanshin = 50;
  if (mbti) kanshin += mbti[0] === 'E' ? 20 : -20;
  kanshin += dayYY === '陽' ? 10 : -10;
  kanshin += LAGNA_EI[lagnaShort] || 0;
  kanshin += SIX_EI[sixGroups] || 0;

  // 姿勢: 積極性 vs 消極性
  let shisei = 50;
  if (mbti) shisei += mbti[3] === 'J' ? 14 : -10;
  shisei += EL_JP[dayEl] || 0;
  shisei += SIX_JP[sixGroups] || 0;
  shisei += LAGNA_JP[lagnaShort] || 0;

  // 目的: 接近性 vs 回避性
  let mokuteki = 50;
  if (mbti) mokuteki += mbti[1] === 'N' ? 12 : -6;
  mokuteki += dayYY === '陽' ? 6 : -6;
  mokuteki += EL_APP[dayEl] || 0;
  mokuteki += SIX_APP[sixGroups] || 0;
  mokuteki += LAGNA_NS[lagnaShort] || 0;

  // 行動: 能動性 vs 受動性
  let koudou = 50;
  if (mbti) { koudou += mbti[2] === 'T' ? 8 : -8; koudou += mbti[3] === 'J' ? 6 : -6; }
  koudou += dayYY === '陽' ? 8 : -8;
  koudou += EL_ACT[dayEl] || 0;
  koudou += LAGNA_ACT[lagnaShort] || 0;
  koudou += SIX_ACT[sixGroups] || 0;

  // 思考: 楽観性 vs 悲観性
  let shikou = 50;
  if (mbti) shikou += mbti[1] === 'N' ? 10 : -4;
  shikou += EL_OPT[dayEl] || 0;
  shikou += LAGNA_OPT[lagnaShort] || 0;
  shikou += SIX_OPT[sixGroups] || 0;
  shikou += SHUKUYO_EL_OPT[shukuyoEl] || 0;

  // 器: 受容性 vs 拒絶/抵抗性
  let utsuwa = 50;
  if (mbti) utsuwa += mbti[2] === 'F' ? 18 : -18;
  utsuwa += EL_RECP[dayEl] || 0;
  utsuwa += LAGNA_RECP[lagnaShort] || 0;
  utsuwa += SIX_RECP[sixGroups] || 0;

  const values = [kanshin, shisei, mokuteki, koudou, shikou, utsuwa];
  const personality = PERSONALITY_DIMENSIONS.map((d, i) => {
    const v = clamp(Math.round(values[i]), 12, 88);
    return { ...d, leftValue: v, rightValue: 100 - v };
  });

  // 旧シード変数を維持（下の感情ロジックで使用）
  const seed = `${dayStem.name}-${monthBranch.name}-${lagnaShort}-${nakshatra.name}-${sixGroups}-${mainShukuyo}-${mbti || '?'}-${profile.blood || '?'}`;

  // --- 感情傾向: 18 種 → 上位 7 + その他 (合計 100%) ---
  // 1) 基本重み（profile/各占星術から決定論的に生成）
  const rawList = EMOTIONS_18.map((label, i) => ({
    label,
    weight: 8 + (seedHash(seed + 'em' + i) % 16)
  }));
  const addBonus = (emoLabel, bonus) => {
    const found = rawList.find(w => w.label === emoLabel);
    if (found) found.weight += bonus;
  };

  // 2) 各入力からの寄与（MBTI / 日干 / 月支 / ラグナ / ナクシャトラ / 六大類 / 本命宿）

  // MBTI（4 軸でそれぞれ感情に寄与）
  if (mbti) {
    if (mbti[0] === 'E') { addBonus('興味/発見', 6); addBonus('興奮/恍惚', 5); addBonus('驚き', 3); }
    else                 { addBonus('冷静', 6); addBonus('妄想/空想', 5); addBonus('羞恥', 4); }
    if (mbti[1] === 'N') { addBonus('興味/発見', 6); addBonus('妄想/空想', 5); addBonus('畏怖', 3); }
    else                 { addBonus('満足/歓喜', 5); addBonus('尊敬', 4); }
    if (mbti[2] === 'T') { addBonus('冷静', 6); addBonus('軽蔑', 4); addBonus('疑問/混乱', 3); }
    else                 { addBonus('親愛/感謝', 7); addBonus('悲しみ/落胆', 5); addBonus('不安/恐怖', 4); }
    if (mbti[3] === 'J') { addBonus('疑心/警戒', 5); addBonus('尊敬', 3); }
    else                 { addBonus('驚き', 5); addBonus('退屈', 3); addBonus('興味/発見', 3); }
  }

  // 日干（五行）
  ({
    '木': [['興味/発見', 5], ['満足/歓喜', 4], ['退屈', 2]],
    '火': [['興奮/恍惚', 7], ['怒り/憤慨', 5], ['驚き', 3]],
    '土': [['満足/歓喜', 6], ['尊敬', 4], ['退屈', 3]],
    '金': [['冷静', 6], ['軽蔑', 4], ['疑問/混乱', 3]],
    '水': [['悲しみ/落胆', 5], ['妄想/空想', 5], ['悩み/葛藤', 3]]
  }[dayEl] || []).forEach(([e, b]) => addBonus(e, b));

  // 月支（12 地支、動物的気質）
  const branchIdx = EARTHLY_BRANCHES.findIndex(b => b.name === monthBranch.name);
  const BRANCH_EMOTIONS = [
    ['冷静', 4],          // 子
    ['尊敬', 4],          // 丑
    ['怒り/憤慨', 4],     // 寅
    ['妄想/空想', 4],     // 卯
    ['興奮/恍惚', 4],     // 辰
    ['疑心/警戒', 4],     // 巳
    ['驚き', 4],          // 午
    ['悲しみ/落胆', 4],   // 未
    ['興味/発見', 4],     // 申
    ['疑問/混乱', 4],     // 酉
    ['親愛/感謝', 4],     // 戌
    ['畏怖', 4]           // 亥
  ];
  if (branchIdx >= 0) {
    const [e, b] = BRANCH_EMOTIONS[branchIdx];
    addBonus(e, b);
  }

  // ラグナ（12 星座）
  ({
    '牡羊': [['怒り/憤慨', 5], ['興奮/恍惚', 4]],
    '牡牛': [['満足/歓喜', 6], ['退屈', 3]],
    '双子': [['興味/発見', 6], ['驚き', 4]],
    '蟹':   [['悲しみ/落胆', 5], ['親愛/感謝', 5]],
    '獅子': [['興奮/恍惚', 6], ['尊敬', 4]],
    '乙女': [['冷静', 5], ['疑問/混乱', 4]],
    '天秤': [['親愛/感謝', 5], ['満足/歓喜', 4]],
    '蠍':   [['畏怖', 5], ['疑心/警戒', 5]],
    '射手': [['興奮/恍惚', 5], ['興味/発見', 4]],
    '山羊': [['尊敬', 5], ['冷静', 4]],
    '水瓶': [['興味/発見', 5], ['妄想/空想', 5]],
    '魚':   [['妄想/空想', 6], ['畏怖', 4]]
  }[lagnaShort] || []).forEach(([e, b]) => addBonus(e, b));

  // ナクシャトラ（quality キーワードから寄与）
  const nq = nakshatra.quality || '';
  const NAK_PATTERNS = [
    [/リーダー|王者|権威|高貴/,    [['興奮/恍惚', 4], ['怒り/憤慨', 3]]],
    [/創造|芸術|魅力/,             [['興味/発見', 4], ['妄想/空想', 4]]],
    [/情熱|変革|革新/,             [['興奮/恍惚', 4], ['怒り/憤慨', 3]]],
    [/探究|知的|学習|広い視野/,    [['興味/発見', 5], ['疑問/混乱', 3]]],
    [/神秘|洞察|霊感|秘密/,        [['畏怖', 4], ['妄想/空想', 3]]],
    [/慈悲|献身|親しみ|友愛/,      [['親愛/感謝', 5], ['尊敬', 3]]],
    [/独立|自由|柔軟/,             [['興味/発見', 3], ['驚き', 3]]],
    [/安定|賢明|普遍/,             [['満足/歓喜', 3], ['尊敬', 3]]],
    [/活動的|冒険|決意|集中/,      [['興奮/恍惚', 4], ['驚き', 4]]],
    [/独創|実践|器用/,             [['興味/発見', 4], ['興奮/恍惚', 3]]],
    [/野心|音楽/,                  [['興奮/恍惚', 3], ['尊敬', 3]]],
    [/癒し|養育|教育|保護/,        [['親愛/感謝', 4], ['満足/歓喜', 3]]]
  ];
  NAK_PATTERNS.forEach(([re, list]) => {
    if (re.test(nq)) list.forEach(([e, b]) => addBonus(e, b));
  });

  // 六大類
  ({
    '安住': [['満足/歓喜', 5], ['退屈', 4], ['冷静', 3]],
    '破壊': [['怒り/憤慨', 6], ['軽蔑', 4]],
    '栄達': [['興奮/恍惚', 5], ['尊敬', 4], ['驚き', 3]],
    '親和': [['親愛/感謝', 7], ['尊敬', 4]],
    '友好': [['満足/歓喜', 4], ['興味/発見', 4]],
    '危機': [['不安/恐怖', 6], ['疑心/警戒', 5]]
  }[sixGroups] || []).forEach(([e, b]) => addBonus(e, b));

  // 本命宿（七曜＝五行）
  ({
    '金': [['冷静', 4], ['尊敬', 3]],
    '土': [['満足/歓喜', 4], ['尊敬', 3]],
    '日': [['興奮/恍惚', 4], ['尊敬', 3]],
    '月': [['妄想/空想', 4], ['悲しみ/落胆', 3]],
    '火': [['怒り/憤慨', 4], ['興奮/恍惚', 4]],
    '水': [['悲しみ/落胆', 3], ['冷静', 4]],
    '木': [['興味/発見', 4], ['満足/歓喜', 3]]
  }[shukuyoEl] || []).forEach(([e, b]) => addBonus(e, b));

  // 3) 5 乗で誇張 → 降順ソート
  rawList.forEach(e => { e.weight = Math.pow(e.weight, 5); });
  rawList.sort((a, b) => b.weight - a.weight);

  // 2) 上位 7 件、残りは「その他」に合算
  const top7 = rawList.slice(0, 7);
  const rest = rawList.slice(7);
  const restWeight = rest.reduce((s, e) => s + e.weight, 0);
  const total = top7.reduce((s, e) => s + e.weight, 0) + restWeight;

  let emotion = [
    ...top7.map(e => ({ label: e.label, percent: (e.weight / total) * 100 })),
    { label: 'その他', percent: (restWeight / total) * 100 }
  ];

  // 3) 小数 1 桁に丸めつつ合計を 100.0 へ正規化（誤差は最大セグメントに足す）
  emotion = emotion.map(e => ({ ...e, percent: Math.round(e.percent * 10) / 10 }));
  const adjust = Math.round((100 - emotion.reduce((s, e) => s + e.percent, 0)) * 10) / 10;
  emotion[0].percent = Math.round((emotion[0].percent + adjust) * 10) / 10;

  return { personality, emotion };
}

// === 分析テキスト生成 (本質・気質 / バイオリズム) ===

// プロフィール基本データ から本質・性格 (≤4 行)
function analyzeBasic(basic) {
  const Z = {
    '牡羊座':'率直で行動的、新しいことに飛び込む情熱','牡牛座':'安定志向で美意識が高く、持続力に優れる',
    '双子座':'知的好奇心が旺盛で、変化と多様性を愛する','蟹座':'感受性豊かで、家族や仲間を大切にする',
    '獅子座':'カリスマ性があり、表現力と自尊心が強い','乙女座':'緻密で実直、細部にこだわる完璧主義',
    '天秤座':'調和を重んじる社交家、バランス感覚に優れる','蠍座':'情熱と洞察力を秘めた、神秘的な探究者',
    '射手座':'自由を愛し、楽観的で哲学的','山羊座':'責任感が強く、長期的視野で着実に積み上げる',
    '水瓶座':'独創的で先進的、人類愛と独立心を併せ持つ','魚座':'直感と共感力に富む、芸術的な感性'
  };
  const B = {
    'A型':'几帳面で誠実、計画性と思いやりを重視する','B型':'マイペースで独創的、好奇心の赴くままに動く',
    'AB型':'合理的かつ感性豊か、二面性を持ち合わせる','O型':'大らかでリーダー気質、目標達成志向が強い'
  };
  const mbtiTrait = (m) => {
    if (!m || m === '—' || !/^[EI][NS][TF][JP]$/.test(m)) return '柔軟な判断力で局面に応じた選択ができる';
    const ei = m[0]==='E' ? '外向的なエネルギー' : '内向的な集中力';
    const ns = m[1]==='N' ? '直感的なビジョン'   : '現実的な観察力';
    const tf = m[2]==='T' ? '論理的な判断'       : '共感的な判断';
    const jp = m[3]==='J' ? '計画と決断を好む'   : '柔軟で開放的な姿勢';
    return `${ei}を持ち、${ns}と${tf}を駆使し、${jp}スタイル`;
  };
  return `あなたは <strong>${basic.zodiac}</strong> 生まれの <strong>${basic.chineseZodiac}</strong>、血液型 <strong>${basic.blood}</strong>、MBTI は <strong>${basic.mbti}</strong>。` +
    `ここから読み取ると、星座は${Z[basic.zodiac]||'独自の個性'}という基盤、血液型は${B[basic.blood]||'個性的な気質'}という土台を作ります。` +
    `さらに MBTI が示す ${mbtiTrait(basic.mbti)} という思考スタイルが組み合わさり、あなたの個性的な人物像が形作られています。`;
}

// --- 5年（今年〜+4年）の運勢テーマ ---
const YEAR_THEMES_10 = [
  '基盤を見直し土台を築く年','新しい出会いと芽吹きの年','上昇と拡大の発展期','実りを収穫する充実期',
  '転換と再編の調整期',    '内省と再充電の静養期', '再起と改革の挑戦期', '飛躍と挑戦の冒険期',
  '達成と評価の頂点期',    '締めくくりと次の準備期'
];
const SHUKUYO_CYCLE_THEMES_5 = [
  '基礎固めと内省の年','人脈と縁を広げる年','実力が試される正念場','報われる成果の収穫期','次の章への準備期間'
];

// 四柱推命 から本質/気質 + バイオリズム
function analyzeFourPillars(yearStem, monthStem, dayPillar, hourPillar, elementInfo, birthYear) {
  // 占術説明 (≤2 行)
  const intro = `四柱推命は、生まれた年月日時から導いた「日干（あなたの本質を表す要素）」と五行で気質を読み解く東洋占術です。`;

  // 個人分析 (≤4 行、ユーザー向け平易な表現)
  const E = {
    '木': { keyword: 'しなやかな成長志向と柔軟性', strength: '新しいことに挑戦して伸びる', weakness: '無理に決断を急がされる', life: '自由に伸びる環境' },
    '火': { keyword: '情熱と表現力で人を惹きつける輝き', strength: 'クリエイティブな発信や人前での表現', weakness: '燃え尽きや無理が続く', life: 'スポットライトの当たる場' },
    '土': { keyword: '安定と包容、信頼を築く粘り強さ', strength: '長期的な信頼関係を育てる', weakness: '急な変化を強いられる', life: '腰を据えて積み上げる場' },
    '金': { keyword: '鋭い判断力と本質を切り取る冷静さ', strength: '専門性を磨き極める', weakness: '繊細さが過ぎてしまう', life: '精度と品質を求められる場' },
    '水': { keyword: '柔軟性と深い知性、本質を見抜く観察眼', strength: '学びや探究を重ねる', weakness: '感情の波に飲まれそうな時', life: '思考と内省ができる環境' }
  }[dayPillar.stem.element] || { keyword: '独自の気質', strength: '自分らしい場面', weakness: '不向きな状況', life: '自分の流儀が活きる場' };
  const personal =
    `ここから読み取ると、あなたの本質は <strong>${dayPillar.stem.element}（${dayPillar.stem.yin_yang}）</strong> の性質。${E.keyword}を持つ気質と言えます。` +
    `性格としては「${E.strength}」場面で本来の力を発揮しやすく、逆に「${E.weakness}」場面では本来の良さが出にくくなる傾向があります。` +
    `最もエネルギーが高まるのは <strong>${elementInfo.season}</strong> の時期で、${E.life}に身を置くと運気の流れに乗りやすくなります。`;

  const nature = intro + personal;

  // バイオリズム: 今年〜+4年 (5 年間、≤3 行)
  const cy = new Date().getFullYear();
  const t = n => YEAR_THEMES_10[((cy + n - birthYear) % 10 + 10) % 10];
  const biorhythm =
    `今年（<strong>${cy} 年</strong>）から 5 年間（〜<strong>${cy + 4} 年</strong>）にかけて、あなたの運勢は <strong>${t(0)}</strong> から始まり、最終年には <strong>${t(4)}</strong> へと移り変わります。` +
    `前半 2〜3 年は ${t(1)} の傾向が強く出やすく、後半は徐々に次のステージへの準備が進む流れです。` +
    `この 5 年は <strong>${dayPillar.stem.element}</strong> の気を意識した過ごし方（${elementInfo.color}を取り入れる／${elementInfo.direction}方位を活かす）が追い風になります。`;

  return { nature, biorhythm };
}

// インド占星術 から本質/気質 + バイオリズム
function analyzeVedic(vedic, birthYear) {
  // 占術説明 (≤2 行)
  const intro = `インド占星術は、ラグナ（生まれた瞬間の上昇星座）・ナクシャトラ（月の宿）・アトマカラカ（魂の支配星）から、外向きの人格と内面の魂を読み解きます。`;

  // 個人分析 (≤4 行)
  const PLANET = {
    '太陽':'自己実現とリーダーシップ', '月':'感受性と心の安定', '火星':'勇気と競争心',
    '水星':'知性とコミュニケーション', '木星':'知恵と寛容、繁栄を呼ぶ力', '金星':'愛と美への感性',
    '土星':'忍耐と長期的な責任', 'ラーフ':'革新と変革への欲求'
  };
  const personal =
    `ここから読み取ると、あなたが他者に与える第一印象や立ち居振る舞いは <strong>${vedic.lagna}</strong> の特性として現れます。` +
    `内面は月宿 <strong>${vedic.nakshatra}</strong>（${vedic.deity} の守護）の感性が源で、直感や本能で動く時の動機はここから生まれます。` +
    `そして魂のテーマは <strong>${vedic.atmakaraka}</strong> = ${PLANET[vedic.atmakaraka] || '独自の課題'}。これが、人生で繰り返し向き合うべき最も重要な学びとなります。`;
  const nature = intro + personal;

  // バイオリズム: 今年〜+4年 (5 年間、≤3 行)
  const cy = new Date().getFullYear();
  const biorhythm =
    `今年（<strong>${cy} 年</strong>）から 5 年間（〜<strong>${cy + 4} 年</strong>）の運勢の主軸は、ヴィムショッタリ・ダシャー <strong>${vedic.dasha}</strong> の影響を受け続けます。` +
    `${vedic.atmakaraka} に関するテーマが繰り返し問われ、特に 2〜3 年目あたりに人生の方向性を定める重要な転機が訪れやすい時期です。` +
    `この 5 年で取り組むべき魂のテーマを意識して動くと、現実の成果と内面の成長が連動しやすくなります。`;

  return { nature, biorhythm };
}

// 宿曜占星術 から本質/気質 + バイオリズム
function analyzeShukuyo(shukuyo, baseShukuyoIdx, birthYear) {
  // 占術説明 (≤2 行)
  const intro = `宿曜占星術は、月が空を一周する間に通る 27 の星座（月宿）から、性格・運命・人との相性を読み解く密教占星術です。`;

  // 個人分析 (≤4 行)
  const SIX_GROUP_TRAIT = {
    '安住':'穏やかで安定を好み、争いを避ける', '破壊':'既存の枠を壊して革新する',
    '栄達':'上を目指し、努力で発展する',     '親和':'人と深く関わり、親しみを大切にする',
    '友好':'対等で刺激し合う関係を好む',     '危機':'波乱を成長のバネに変える'
  };
  const LUMINARY_TRAIT = {
    '日':'太陽のような明るさと活力',  '月':'月のような感受性と内省',
    '火':'火のような情熱と勢い',      '水':'水のような知性と適応力',
    '木':'木のような成長と寛容',      '金':'金のような美意識と判断力',
    '土':'土のような安定と粘り強さ'
  };
  const baseTrait = SHUKUYO_27[baseShukuyoIdx].personality;
  const sevenLumKey = shukuyo.sevenLuminary.replace('曜', '');
  const personal =
    `ここから読み取ると、あなたは本命宿 <strong>${shukuyo.mainShukuyo}</strong> の影響を受け、「${baseTrait}」という気質を持ちます。` +
    `<strong>${shukuyo.sixGroups}</strong> の六大類エネルギー型として、${SIX_GROUP_TRAIT[shukuyo.sixGroups] || '独自の流儀で動く'}スタイルが人付き合いに自然と表れます。` +
    `さらに七曜の <strong>${shukuyo.sevenLuminary}</strong> から、${LUMINARY_TRAIT[sevenLumKey] || '独自の気質'}が日々の判断や直感のリズムを支配しています。`;
  const nature = intro + personal;

  // バイオリズム: 今年〜+4年 (5 年間、≤3 行)
  const cy = new Date().getFullYear();
  const c = n => SHUKUYO_CYCLE_THEMES_5[((cy + n + baseShukuyoIdx) % 5 + 5) % 5];
  const biorhythm =
    `今年（<strong>${cy} 年</strong>）から 5 年間（〜<strong>${cy + 4} 年</strong>）の宿曜の波は、<strong>${c(0)}</strong> から始まり、最終年は <strong>${c(4)}</strong> という流れになります。` +
    `この 5 年は「栄・親・友」関係日に重要な決断や勝負をぶつけると宿曜の波に乗りやすく、` +
    `「壊・衰・危」の日は守りと充電に当てるのが、この時期を最大限活かす鉄則です。`;

  return { nature, biorhythm };
}

// --- 四柱推命: 日柱（60日周期、1900-01-01 = 甲戌を基準） ---
function calcDayPillar(year, month, day) {
  const base = new Date(1900, 0, 1).getTime();
  const target = new Date(year, month - 1, day).getTime();
  const diff = Math.floor((target - base) / (1000 * 60 * 60 * 24));
  const stemIdx = ((diff % 10) + 10) % 10;
  const branchIdx = ((diff + 10) % 12 + 12) % 12;
  return { stem: HEAVENLY_STEMS[stemIdx], branch: EARTHLY_BRANCHES[branchIdx], stemIdx };
}

// --- 四柱推命: 時柱（時辰 12 区分） ---
function calcHourPillar(hour, dayStemIdx) {
  if (hour === null || hour === undefined || hour === '') return null;
  const h = parseInt(hour);
  if (isNaN(h)) return null;
  // 子=23-1, 丑=1-3, 寅=3-5, ..., 亥=21-23
  const branchIdx = (Math.floor((h + 1) / 2)) % 12;
  // 時干は日干に応じて開始位置が変わる
  const startStem = [(0), (2), (4), (6), (8), (0), (2), (4), (6), (8)][dayStemIdx];
  const stemIdx = (startStem + branchIdx) % 10;
  return { stem: HEAVENLY_STEMS[stemIdx], branch: EARTHLY_BRANCHES[branchIdx] };
}

// --- インド占星術: ラグナ（簡易：出生時刻と月から導出） ---
const LAGNAS_12 = ['牡羊座','牡牛座','双子座','蟹座','獅子座','乙女座','天秤座','蠍座','射手座','山羊座','水瓶座','魚座'];
function calcLagna(profile, year, month, day) {
  let hour = profile && profile.birthHour != null ? parseInt(profile.birthHour) : null;
  if (isNaN(hour)) hour = null;
  if (hour === null) hour = (month * 31 + day) % 24;
  const idx = (Math.floor(hour / 2) + month) % 12;
  return LAGNAS_12[idx] + 'ラグナ';
}

// --- アトマカラカ（簡易：生年月日から決定） ---
const VEDIC_PLANETS = ['太陽','月','火星','水星','木星','金星','土星','ラーフ'];
function calcAtmakaraka(year, month, day) {
  const idx = ((year + month * 30 + day) % VEDIC_PLANETS.length + VEDIC_PLANETS.length) % VEDIC_PLANETS.length;
  return VEDIC_PLANETS[idx];
}

// --- ダシャー（Vimshottari、簡易：年齢から決定） ---
const DASHAS = [
  { name: 'ケートゥ期', years: 7 },
  { name: '金星期',     years: 20 },
  { name: '太陽期',     years: 6 },
  { name: '月期',       years: 10 },
  { name: '火星期',     years: 7 },
  { name: 'ラーフ期',   years: 18 },
  { name: '木星期',     years: 16 },
  { name: '土星期',     years: 19 },
  { name: '水星期',     years: 17 }
];
function calcDasha(birthYear) {
  const age = new Date().getFullYear() - birthYear;
  let mod = ((age % 120) + 120) % 120;
  let acc = 0;
  for (const d of DASHAS) {
    acc += d.years;
    if (mod < acc) return d.name;
  }
  return DASHAS[0].name;
}

// --- 宿曜占星術: 27宿 ---
const SHUKUYO_27 = [
  { name: '昴宿', luminary: '金' }, { name: '畢宿', luminary: '土' }, { name: '觜宿', luminary: '日' },
  { name: '参宿', luminary: '月' }, { name: '井宿', luminary: '火' }, { name: '鬼宿', luminary: '水' },
  { name: '柳宿', luminary: '木' }, { name: '星宿', luminary: '金' }, { name: '張宿', luminary: '土' },
  { name: '翼宿', luminary: '日' }, { name: '軫宿', luminary: '月' }, { name: '角宿', luminary: '火' },
  { name: '亢宿', luminary: '水' }, { name: '氐宿', luminary: '木' }, { name: '房宿', luminary: '金' },
  { name: '心宿', luminary: '土' }, { name: '尾宿', luminary: '日' }, { name: '箕宿', luminary: '月' },
  { name: '斗宿', luminary: '火' }, { name: '女宿', luminary: '水' }, { name: '虚宿', luminary: '木' },
  { name: '危宿', luminary: '金' }, { name: '室宿', luminary: '土' }, { name: '壁宿', luminary: '日' },
  { name: '奎宿', luminary: '月' }, { name: '婁宿', luminary: '火' }, { name: '胃宿', luminary: '水' }
];

function calcShukuyo(year, month, day) {
  const base = new Date(1900, 0, 1).getTime();
  const target = new Date(year, month - 1, day).getTime();
  const diff = Math.floor((target - base) / (1000 * 60 * 60 * 24));
  const idx = ((diff % 27) + 27) % 27;
  return { ...SHUKUYO_27[idx], index: idx };
}

// 命（現世） = 本命宿、業（前世） = +9、胎（来世） = +18
function calcShukuyoLifeKarmaWomb(baseIdx) {
  return {
    life:  SHUKUYO_27[baseIdx],
    karma: SHUKUYO_27[(baseIdx + 9) % 27],
    womb:  SHUKUYO_27[(baseIdx + 18) % 27]
  };
}

// 六大類（簡易：本命宿の index で 6 グループ分類）
const SIX_GROUPS = ['安住','破壊','栄達','親和','友好','危機'];
function calcSixGroups(baseIdx) {
  return SIX_GROUPS[baseIdx % 6];
}

// 七曜（日月火水木金土：生年月日の曜日から決定）
const SEVEN_LUMINARIES = ['日','月','火','水','木','金','土'];
function calcSevenLuminary(year, month, day) {
  return SEVEN_LUMINARIES[new Date(year, month - 1, day).getDay()];
}

// 今の運勢（本日の宿と本命宿との距離による関係）
const SHUKUYO_RELATIONS_BY_DISTANCE = [
  '命の関係 — 自分自身を映す日',
  '業の関係 — カルマを清算する日',
  '胎の関係 — 来世への種を蒔く日',
  '栄の関係 — 最良の発展日',
  '親の関係 — 縁が深まる日',
  '友の関係 — 仲間と動く日',
  '衰の関係 — エネルギーが下がる日',
  '危の関係 — 試練と成長の日',
  '成の関係 — 成果を出せる日'
];
function calcCurrentShukuyoFortune(baseIdx) {
  const base = new Date(1900, 0, 1).getTime();
  const today = new Date();
  const diff = Math.floor((today.setHours(0,0,0,0) - base) / (1000 * 60 * 60 * 24));
  const todayIdx = ((diff % 27) + 27) % 27;
  const distance = (((todayIdx - baseIdx) % 27) + 27) % 27;
  return SHUKUYO_RELATIONS_BY_DISTANCE[distance % SHUKUYO_RELATIONS_BY_DISTANCE.length];
}

// --- ナクシャトラ → 守護神（既存 NAKSHATRAS から取り出し済みなのでヘルパ不要） ---

// --- Calculation Functions ---

function calcHeavenlyStem(year) {
  return HEAVENLY_STEMS[(year - 4) % 10];
}

function calcEarthlyBranch(year) {
  return EARTHLY_BRANCHES[(year - 4) % 12];
}

function calcMonthStem(year, month) {
  const yearStemIndex = (year - 4) % 10;
  const monthIndex = ((yearStemIndex % 5) * 2 + month - 1) % 10;
  return HEAVENLY_STEMS[monthIndex];
}

function calcMonthBranch(month) {
  return EARTHLY_BRANCHES[(month + 1) % 12];
}

function calcNakshatra(month, day) {
  const dayOfYear = (month - 1) * 30 + day;
  return NAKSHATRAS[dayOfYear % 27];
}

function calcDominantElement(yearStem, monthStem) {
  const elements = [yearStem.element, monthStem.element];
  const count = {};
  elements.forEach(e => count[e] = (count[e] || 0) + 1);
  // Combine with some variety
  const allElements = Object.keys(count);
  return allElements.length > 1 ? allElements[0] : yearStem.element;
}

// --- Fortune Generation ---

function generateFortune(birthYear, birthMonth, birthDay) {
  const profile = loadStoredProfile();

  const yearStem = calcHeavenlyStem(birthYear);
  const yearBranch = calcEarthlyBranch(birthYear);
  const monthStem = calcMonthStem(birthYear, birthMonth);
  const monthBranch = calcMonthBranch(birthMonth);
  const dayPillar = calcDayPillar(birthYear, birthMonth, birthDay);
  const hourPillar = calcHourPillar(profile.birthHour, dayPillar.stemIdx);
  const nakshatra = calcNakshatra(birthMonth, birthDay);
  const dominantElement = yearStem.element;
  const elementInfo = FIVE_ELEMENTS[dominantElement];

  // --- ブロック 1: 血液型 / 星座 / 干支 / MBTI ---
  const animalIdx = ((birthYear - 4) % 12 + 12) % 12;
  const basic = {
    blood:          formatBloodType(profile.blood),
    zodiac:         calcZodiacSign(birthMonth, birthDay),
    chineseZodiac:  `${ANIMAL_NAMES[animalIdx]}（${EARTHLY_BRANCHES[animalIdx].name}）`,
    mbti:           profile.mbti ? String(profile.mbti).toUpperCase() : '—'
  };

  // --- 傾向分析の入力データを先に揃える ---
  const lagnaForTendency = calcLagna(profile, birthYear, birthMonth, birthDay);
  const shukuyoData = calcShukuyo(birthYear, birthMonth, birthDay);
  const sixGroupsForTendency = calcSixGroups(shukuyoData.index);

  // --- ブロック 1.5: 傾向分析（MBTI × 四柱推命 × インド占星術 × 宿曜占星術 の掛け合わせ） ---
  const tendency = calcTendency({
    profile,
    dayStem:     dayPillar.stem,
    monthBranch,
    lagna:       lagnaForTendency,
    nakshatra,
    sixGroups:   sixGroupsForTendency,
    mainShukuyo: shukuyoData.name,
    shukuyoIdx:  shukuyoData.index
  });

  // --- ブロック 2: 四柱推命（柱・地支・天干） ---
  const fourPillars = {
    pillars: {
      year:  `${yearStem.name}${yearBranch.name}`,
      month: `${monthStem.name}${monthBranch.name}`,
      day:   `${dayPillar.stem.name}${dayPillar.branch.name}`,
      hour:  hourPillar ? `${hourPillar.stem.name}${hourPillar.branch.name}` : '—'
    },
    branches: {
      year:  yearBranch.name,
      month: monthBranch.name,
      day:   dayPillar.branch.name,
      hour:  hourPillar ? hourPillar.branch.name : '—'
    },
    stems: {
      year:  yearStem.name,
      month: monthStem.name,
      day:   dayPillar.stem.name,
      hour:  hourPillar ? hourPillar.stem.name : '—'
    }
  };

  // --- ブロック 3: インド占星術（南インド式） ---
  const vedic = {
    lagna:      lagnaForTendency,
    atmakaraka: calcAtmakaraka(birthYear, birthMonth, birthDay),
    nakshatra:  nakshatra.name,
    deity:      nakshatra.deity,
    dasha:      calcDasha(birthYear)
  };

  // --- ブロック 4: 宿曜占星術 ---
  const lkw = calcShukuyoLifeKarmaWomb(shukuyoData.index);
  const shukuyo = {
    sixGroups:      sixGroupsForTendency,
    mainShukuyo:    shukuyoData.name,
    life:           `${lkw.life.name}（${shukuyoData.name === lkw.life.name ? '本命宿' : '現世'}）`,
    karma:          `${lkw.karma.name}（前世）`,
    womb:           `${lkw.womb.name}（来世）`,
    sevenLuminary:  `${calcSevenLuminary(birthYear, birthMonth, birthDay)}曜`,
    currentFortune: calcCurrentShukuyoFortune(shukuyoData.index)
  };

  return {
    // 四柱推命（互換のため既存フィールドも維持）
    yearPillar: `${yearStem.name}${yearBranch.name}`,
    monthPillar: `${monthStem.name}${monthBranch.name}`,
    heavenlyStem: yearStem,
    earthlyBranch: yearBranch,
    element: dominantElement,
    elementInfo: elementInfo,

    // インド占星術
    nakshatra: nakshatra,

    // 鑑定結果
    title: `${yearStem.name}${yearBranch.name}の${nakshatra.name}`,
    subtitle: `${dominantElement}の気質 × ${nakshatra.deity}の守護`,

    overall: `あなたは${yearStem.trait}性質を持ち、${nakshatra.trait}。${dominantElement}のエネルギーが強く、${elementInfo.season}の時期に特に運気が高まります。インド占星術では${nakshatra.name}（${nakshatra.deity}の守護）の影響を受け、${nakshatra.quality}な性質が際立ちます。四柱推命の${yearStem.name}${yearBranch.name}と${nakshatra.name}の組み合わせは、${yearStem.yin_yang === "陽" ? "積極的に道を切り開く" : "内面の力で周囲を導く"}タイプであることを示しています。`,

    career: generateCareerFortune(yearStem, nakshatra, elementInfo),
    love: generateLoveFortune(yearStem, yearBranch, nakshatra),
    money: generateMoneyFortune(yearStem, elementInfo, nakshatra),
    health: generateHealthFortune(elementInfo, nakshatra),

    // ブロック構造化データ
    basic, tendency, fourPillars, vedic, shukuyo,

    // 各ブロックの分析テキスト
    basicAnalysis:       analyzeBasic(basic),
    fourPillarsAnalysis: analyzeFourPillars(yearStem, monthStem, dayPillar, hourPillar, elementInfo, birthYear),
    vedicAnalysis:       analyzeVedic(vedic, birthYear),
    shukuyoAnalysis:     analyzeShukuyo(shukuyo, shukuyoData.index, birthYear)
  };
}

function generateCareerFortune(stem, nakshatra, elementInfo) {
  const careerMap = {
    "木": "企画力や成長戦略に優れ、新規事業やスタートアップとの相性が良いでしょう。",
    "火": "プレゼンテーションや営業など、人前で輝く仕事で力を発揮します。",
    "土": "マネジメントやプロジェクト管理など、安定した基盤を築く仕事が向いています。",
    "金": "精密な作業や分析が求められる仕事、金融やIT分野で才能を発揮するでしょう。",
    "水": "クリエイティブな分野や研究職、コンサルティングなど知識を活かす仕事が天職です。"
  };
  return `${careerMap[stem.element]}${nakshatra.quality}な性格は職場でも高く評価されます。${stem.yin_yang === "陽" ? "リーダーシップを発揮する場面が増えそうです。周囲を巻き込みながら大きなプロジェクトに挑戦してみてください。" : "縁の下の力持ちとして重要な役割を果たすでしょう。あなたの丁寧な仕事ぶりが認められる時が近づいています。"}`;
}

function generateLoveFortune(stem, branch, nakshatra) {
  const loveMap = {
    "木": "誠実で一途な愛情を持つあなた。自然体でいられる相手との縁が深まります。",
    "火": "情熱的で魅力的なあなたは周囲を惹きつけます。ただし、相手の気持ちにも目を向けて。",
    "土": "安定した愛情を築けるタイプ。信頼を大切にするあなたには、穏やかなパートナーが理想的。",
    "金": "理想が高いあなたですが、完璧を求めすぎないことも大切。心のつながりを重視して。",
    "水": "深い愛情と包容力を持つあなた。直感でピンとくる相手を大切にしてください。"
  };
  return `${loveMap[stem.element]}${nakshatra.name}の守護を受けるあなたは、${nakshatra.trait.slice(0, 15)}という特性が恋愛面でも活きます。${branch.animal}年生まれの方とは特に、心が通じ合いやすい傾向があります。`;
}

function generateMoneyFortune(stem, elementInfo, nakshatra) {
  const moneyMap = {
    "木": "成長型の投資や自己投資との相性が良い時期。学びにお金を使うことで大きなリターンが期待できます。",
    "火": "直感が冴える時期。ただし衝動買いには注意。計画的な支出を心がけましょう。",
    "土": "コツコツ貯蓄する力に恵まれています。不動産や長期投資など、堅実な資産形成が吉。",
    "金": "お金に対する鋭い感覚を持っています。副業や新しい収入源を探ると良い結果が出るでしょう。",
    "水": "お金の流れを読む力があります。情報収集を怠らず、タイミングを見極めて行動を。"
  };
  return `${moneyMap[stem.element]}${nakshatra.deity}の守護により、${elementInfo.direction}方位に金運のエネルギーが集まっています。ラッキーカラーの${elementInfo.color}を財布やアクセサリーに取り入れると、金運がさらにアップするでしょう。`;
}

function generateHealthFortune(elementInfo, nakshatra) {
  const healthMap = {
    "木": "肝臓や目のケアを意識しましょう。ストレッチやヨガなど、柔軟性を高める運動がおすすめです。",
    "火": "心臓や血行に注意。適度な有酸素運動と十分な休息のバランスを取りましょう。",
    "土": "胃腸のコンディションに気を配って。規則正しい食事と消化に良い食材を選ぶことが大切。",
    "金": "呼吸器系のケアが重要。深呼吸の習慣や、空気の良い場所での散歩が健康運をアップします。",
    "水": "腎臓や水分バランスに注意。十分な水分補給と、冷えへの対策を心がけましょう。"
  };
  return `${healthMap[elementInfo.symbol === "🌿" ? "木" : elementInfo.symbol === "🔥" ? "火" : elementInfo.symbol === "🏔️" ? "土" : elementInfo.symbol === "⚔️" ? "金" : "水"]}${nakshatra.name}の影響で、${elementInfo.season}の季節の変わり目には特に体調管理を意識してください。${elementInfo.direction}の方角に向かって深呼吸すると、気の流れが整います。`;
}

// --- UI Functions ---

let selectedGender = null;
let currentResult = null;

// Initialize date selectors
document.addEventListener('DOMContentLoaded', () => {
  const yearSelect = document.getElementById('birth-year');
  const monthSelect = document.getElementById('birth-month');
  const daySelect = document.getElementById('birth-day');

  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1930; y--) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = `${y}年`;
    yearSelect.appendChild(opt);
  }

  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = `${m}月`;
    monthSelect.appendChild(opt);
  }

  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = `${d}日`;
    daySelect.appendChild(opt);
  }

  // index.html で保存済みの profile があれば、フォームを自動入力し即時鑑定
  const p = loadStoredProfile();
  if (p && p.birthYear && p.birthMonth && p.birthDay) {
    yearSelect.value = String(p.birthYear);
    monthSelect.value = String(p.birthMonth);
    daySelect.value = String(p.birthDay);
    if (p.gender) {
      const gBtn = document.getElementById(`gender-${p.gender}`);
      if (gBtn) selectGender(p.gender);
    }
    // 0 秒後に発火（DOM 確定後）
    setTimeout(() => startAstrology(), 0);
  }
});

function selectGender(gender) {
  selectedGender = gender;
  document.querySelectorAll('[id^="gender-"]').forEach(btn => {
    btn.classList.remove('btn--primary');
    btn.classList.add('btn--outline');
  });
  const selected = document.getElementById(`gender-${gender}`);
  selected.classList.remove('btn--outline');
  selected.classList.add('btn--primary');
}

function showPhase(phaseId) {
  document.querySelectorAll('[id^="phase-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById(phaseId).classList.remove('hidden');
}

function startAstrology() {
  const year = parseInt(document.getElementById('birth-year').value);
  const month = parseInt(document.getElementById('birth-month').value);
  const day = parseInt(document.getElementById('birth-day').value);

  if (!year || !month || !day) {
    alert('生年月日を入力してください');
    return;
  }

  showPhase('phase-loading');

  setTimeout(() => {
    currentResult = generateFortune(year, month, day);
    displayResult(currentResult);
    showPhase('phase-result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 2000);
}

function displayResult(result) {
  document.getElementById('astro-symbol').textContent = result.nakshatra.symbol;
  document.getElementById('astro-title').textContent = result.title;
  document.getElementById('astro-subtitle').textContent = result.subtitle;

  // 4 ブロック描画
  const chartEl = document.getElementById('astro-chart');
  chartEl.innerHTML = renderFourBlocks(result);

  // Fortunes
  document.getElementById('astro-overall').textContent = result.overall;
  document.getElementById('astro-career').textContent = result.career;
  document.getElementById('astro-love').textContent = result.love;
  document.getElementById('astro-money').textContent = result.money;
  document.getElementById('astro-health').textContent = result.health;
}

// 各ブロックを HTML 文字列で組み立て
function renderFourBlocks(result) {
  const item = (label, value) => `
    <div class="astro-block__item">
      <div class="astro-block__label">${label}</div>
      <div class="astro-block__value">${value}</div>
    </div>`;

  const blockBasic = `
    <section class="astro-block astro-block--joined-down">
      <h3 class="astro-block__title">プロフィール基本データ</h3>
      <div class="astro-block__grid">
        ${item('血液型', result.basic.blood)}
        ${item('星座',   result.basic.zodiac)}
        ${item('干支',   result.basic.chineseZodiac)}
        ${item('MBTI',  result.basic.mbti)}
      </div>
    </section>`;

  const blockTendency = renderTendencyBlock(result.tendency);

  const blockFourPillars = `
    <section class="astro-block astro-block--joined-down">
      <h3 class="astro-block__title">四柱推命</h3>
      <p class="astro-block__sub">柱</p>
      <div class="astro-block__grid astro-block__grid--four">
        ${item('年柱', result.fourPillars.pillars.year)}
        ${item('月柱', result.fourPillars.pillars.month)}
        ${item('日柱', result.fourPillars.pillars.day)}
        ${item('時柱', result.fourPillars.pillars.hour)}
      </div>
      <p class="astro-block__sub">地支</p>
      <div class="astro-block__grid astro-block__grid--four">
        ${item('年支', result.fourPillars.branches.year)}
        ${item('月支', result.fourPillars.branches.month)}
        ${item('日支', result.fourPillars.branches.day)}
        ${item('時支', result.fourPillars.branches.hour)}
      </div>
      <p class="astro-block__sub">天干</p>
      <div class="astro-block__grid astro-block__grid--four">
        ${item('年干', result.fourPillars.stems.year)}
        ${item('月干', result.fourPillars.stems.month)}
        ${item('日干', result.fourPillars.stems.day)}
        ${item('時干', result.fourPillars.stems.hour)}
      </div>
    </section>`;

  const blockVedic = `
    <section class="astro-block astro-block--joined-down">
      <h3 class="astro-block__title">インド占星術（南インド式）</h3>
      <div class="astro-block__grid">
        ${item('ラグナ（器）',         result.vedic.lagna)}
        ${item('アトマカラカ（惑星）', result.vedic.atmakaraka)}
        ${item('ナクシャトラ（月宿）', result.vedic.nakshatra)}
        ${item('守護神',               result.vedic.deity)}
        ${item('ダシャー（今の運気）', result.vedic.dasha)}
      </div>
    </section>`;

  const blockShukuyo = `
    <section class="astro-block astro-block--joined-down">
      <h3 class="astro-block__title">宿曜占星術</h3>
      <div class="astro-block__grid">
        ${item('六大類',           result.shukuyo.sixGroups)}
        ${item('本命宿（二十七宿）', result.shukuyo.mainShukuyo)}
        ${item('命（現世）',         result.shukuyo.life)}
        ${item('業（前世）',         result.shukuyo.karma)}
        ${item('胎（来世）',         result.shukuyo.womb)}
        ${item('七曜',               result.shukuyo.sevenLuminary)}
        ${item('今の運勢',           result.shukuyo.currentFortune)}
      </div>
    </section>`;

  // 各ブロックの直下に分析テキストパネルを挿入
  const analysisBasic = renderAnalysisPanel([
    { title: '本質・性格', text: result.basicAnalysis }
  ]);
  const analysisFourPillars = renderAnalysisPanel([
    { title: '本質・気質',             text: result.fourPillarsAnalysis.nature },
    { title: 'バイオリズム（運勢の波）', text: result.fourPillarsAnalysis.biorhythm }
  ]);
  const analysisVedic = renderAnalysisPanel([
    { title: '本質・気質',             text: result.vedicAnalysis.nature },
    { title: 'バイオリズム（運勢の波）', text: result.vedicAnalysis.biorhythm }
  ]);
  const analysisShukuyo = renderAnalysisPanel([
    { title: '本質・気質',             text: result.shukuyoAnalysis.nature },
    { title: 'バイオリズム（運勢の波）', text: result.shukuyoAnalysis.biorhythm }
  ]);

  return blockBasic
    + blockTendency       + analysisBasic
    + blockFourPillars    + analysisFourPillars
    + blockVedic          + analysisVedic
    + blockShukuyo        + analysisShukuyo;
}

// 分析テキストパネル: 上のブロックと「くっ付いて」見えるよう joined-up を付与
function renderAnalysisPanel(sections) {
  const body = sections.map(s => `
    <div class="astro-analysis__section">
      <h4 class="astro-analysis__title">${s.title}</h4>
      <p class="astro-analysis__text">${s.text}</p>
    </div>
  `).join('');
  return `<section class="astro-block astro-analysis astro-block--joined-up">${body}</section>`;
}

// 傾向分析ブロック（性格 6 軸 + 感情円グラフ）
function renderTendencyBlock(t) {
  const bars = t.personality.map(d => `
    <div class="tendency-bar">
      <span class="tendency-bar__category">【${d.label}】</span>
      <span class="tendency-bar__side tendency-bar__side--left">${d.leftLabel} ${d.leftValue}%</span>
      <div class="tendency-bar__visual">
        <span class="tendency-bar__fill tendency-bar__fill--left" style="flex:${d.leftValue}"></span>
        <span class="tendency-bar__fill tendency-bar__fill--right" style="flex:${d.rightValue}"></span>
      </div>
      <span class="tendency-bar__side tendency-bar__side--right">${d.rightValue}% ${d.rightLabel}</span>
    </div>
  `).join('');

  // 円グラフ: 12時方向開始・右回り・降順 7 件 + その他 = 8 セグメント
  // 配色は HSL レインボー（8 セグメント分に均等割り）
  const EMOTION_COLORS = t.emotion.map((_, i) => `hsl(${Math.floor((i * 360) / 8)}, 55%, 60%)`);

  // viewBox: 横長にしてラベルをサイドに配置（リーダー線で結ぶ）
  const cx = 300, cy = 230, r = 150;
  const elbowR = r + 24;   // リーダー線の折れ点（円の外側）
  const sideOffset = 70;   // 折れ点から横方向への延長距離
  let cum = 0;

  const segs = t.emotion.map((e, i) => {
    const start = cum;
    const angle = (e.percent / 100) * 360;
    cum += angle;
    const end = cum;
    const mid = (start + end) / 2;

    const startRad = (start - 90) * Math.PI / 180;
    const endRad   = (end   - 90) * Math.PI / 180;
    const midRad   = (mid   - 90) * Math.PI / 180;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const large = angle > 180 ? 1 : 0;
    const path = `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${EMOTION_COLORS[i]}" stroke="#1a1106" stroke-width="0.6"/>`;

    // リーダー線: 円縁 → 折れ点 → 横方向に延長
    const px = cx + r * Math.cos(midRad);
    const py = cy + r * Math.sin(midRad);
    const ex = cx + elbowR * Math.cos(midRad);
    const ey = cy + elbowR * Math.sin(midRad);
    const isRight = mid < 180;
    const sx = isRight ? ex + sideOffset : ex - sideOffset;
    const sy = ey;

    const leader = `<polyline points="${px},${py} ${ex},${ey} ${sx},${sy}" class="emotion-chart__leader"/>`;

    // ラベル: 横線の端から少し離して、左右どちら側か応じて text-anchor 切替
    const tx = isRight ? sx + 6 : sx - 6;
    const anchor = isRight ? 'start' : 'end';
    const label = `
      <text class="emotion-chart__label-name"    x="${tx}" y="${sy - 4}" text-anchor="${anchor}">${e.label}</text>
      <text class="emotion-chart__label-percent" x="${tx}" y="${sy + 13}" text-anchor="${anchor}">${e.percent.toFixed(1)}%</text>
    `;

    return path + leader + label;
  }).join('');

  return `
    <section class="astro-block astro-block--tendency astro-block--joined-up astro-block--joined-down">
      <div class="tendency-columns">
        <div class="tendency-column tendency-column--left">
          <h3 class="astro-block__title astro-block__title--inner">性格傾向</h3>
          <div class="tendency-bars">${bars}</div>
        </div>
        <div class="tendency-column tendency-column--right">
          <h3 class="astro-block__title astro-block__title--inner">感情</h3>
          <div class="emotion-chart">
            <svg viewBox="0 0 600 460" class="emotion-chart__pie" aria-label="感情の分布">${segs}</svg>
          </div>
        </div>
      </div>
    </section>
  `;
}

function resetAstrology() {
  currentResult = null;
  selectedGender = null;
  document.querySelectorAll('[id^="gender-"]').forEach(btn => {
    btn.classList.remove('btn--primary');
    btn.classList.add('btn--outline');
  });
  showPhase('phase-input');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Share
function shareTwitter() {
  if (!currentResult) return;
  const text = encodeURIComponent(`🌟 x-TENの命術占い結果：「${currentResult.title}」\n${currentResult.overall.slice(0, 60)}...\n`);
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareLine() {
  if (!currentResult) return;
  const text = encodeURIComponent(`🌟 x-TENの命術占い結果：「${currentResult.title}」\n${currentResult.overall.slice(0, 60)}...`);
  window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
}
