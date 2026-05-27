// ========================================
// Four Pillars × Indian Astrology - 天推 AI
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
  const yearStem = calcHeavenlyStem(birthYear);
  const yearBranch = calcEarthlyBranch(birthYear);
  const monthStem = calcMonthStem(birthYear, birthMonth);
  const monthBranch = calcMonthBranch(birthMonth);
  const nakshatra = calcNakshatra(birthMonth, birthDay);
  const dominantElement = yearStem.element;
  const elementInfo = FIVE_ELEMENTS[dominantElement];

  return {
    // 四柱推命
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

    chart: [
      { label: "年柱", value: `${yearStem.name}${yearBranch.name}` },
      { label: "月柱", value: `${monthStem.name}${monthBranch.name}` },
      { label: "五行", value: `${dominantElement}（${yearStem.yin_yang}）` },
      { label: "干支", value: `${yearBranch.animal}年` },
      { label: "ナクシャトラ", value: nakshatra.name },
      { label: "守護神", value: nakshatra.deity }
    ]
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

  // Chart
  const chartEl = document.getElementById('astro-chart');
  chartEl.innerHTML = result.chart.map(item => `
    <div class="astro-result__chart-item">
      <div class="astro-result__chart-label">${item.label}</div>
      <div class="astro-result__chart-value">${item.value}</div>
    </div>
  `).join('');

  // Fortunes
  document.getElementById('astro-overall').textContent = result.overall;
  document.getElementById('astro-career').textContent = result.career;
  document.getElementById('astro-love').textContent = result.love;
  document.getElementById('astro-money').textContent = result.money;
  document.getElementById('astro-health').textContent = result.health;
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
  const text = encodeURIComponent(`🌟 天推 AIの命術占い結果：「${currentResult.title}」\n${currentResult.overall.slice(0, 60)}...\n`);
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareLine() {
  if (!currentResult) return;
  const text = encodeURIComponent(`🌟 天推 AIの命術占い結果：「${currentResult.title}」\n${currentResult.overall.slice(0, 60)}...`);
  window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
}
