// ========================================
// Omikuji (御神籤) - x-TEN
// ========================================

const FORTUNE_LEVELS = [
  { key: 'daikichi', label: '大吉', weight: 15, cssClass: 'omikuji-result__level--daikichi' },
  { key: 'kichi',    label: '吉',   weight: 25, cssClass: 'omikuji-result__level--kichi' },
  { key: 'chukichi', label: '中吉', weight: 20, cssClass: 'omikuji-result__level--chukichi' },
  { key: 'shokichi', label: '小吉', weight: 15, cssClass: 'omikuji-result__level--shokichi' },
  { key: 'suekichi', label: '末吉', weight: 15, cssClass: 'omikuji-result__level--suekichi' },
  { key: 'kyo',      label: '凶',   weight: 10, cssClass: 'omikuji-result__level--kyo' }
];

const CATEGORIES = {
  願望: [
    "思い続ければ必ず叶う時が来る",
    "焦らず時を待てば自然と道は開ける",
    "小さな一歩が大きな実りを生む",
    "周囲の助けを借りれば叶いやすい",
    "心の奥底にある本当の願いに気づく時",
    "願いは形を変えて叶うことがある"
  ],
  恋愛: [
    "素直な気持ちを伝えれば良い方向へ",
    "新しい出会いの予感あり、心を開いて",
    "相手を思いやる心が絆を深める",
    "片想いに進展の兆し、勇気を出して",
    "今の関係を大切に育てることが吉",
    "自分磨きが恋の運気を高める鍵"
  ],
  仕事: [
    "地道な努力が認められる時期",
    "新しい挑戦が成長の糧となる",
    "チームワークを大切にすれば成果が出る",
    "転機が訪れる予感、準備を怠りなく",
    "得意分野を活かせば道が開ける",
    "焦らず着実に進めることが成功の鍵"
  ],
  金運: [
    "思わぬ臨時収入の可能性あり",
    "堅実な貯蓄が将来の安心を生む",
    "無駄遣いに注意すれば安泰",
    "投資よりも自己投資が実を結ぶ",
    "人との縁がお金の縁を運んでくる",
    "感謝の心がさらなる豊かさを呼ぶ"
  ],
  健康: [
    "規則正しい生活が体調を整える",
    "適度な運動で心身ともに充実",
    "睡眠を十分にとることが大切",
    "季節の変わり目に注意して過ごすこと",
    "心の余裕が健康の基盤となる",
    "食事を見直すことで活力が湧く"
  ],
  旅行: [
    "西の方角に良い縁あり",
    "水辺への旅が心を癒す",
    "思い立ったが吉日、近場でも効果あり",
    "古い神社仏閣を訪れると運気上昇",
    "北の方角へ向かえば新たな発見あり",
    "一人旅よりも誰かと共に行くが吉"
  ],
  学業: [
    "集中力が高まる時期、学びに最適",
    "基礎を固め直すことで飛躍する",
    "新しい分野への挑戦が視野を広げる",
    "先生や先輩の助言が道を照らす",
    "読書が知恵の泉となる時",
    "継続は力なり、諦めずに続けること"
  ]
};

const POEMS = [
  "春風に\n　心ほどけて\n　花ひらく\n　待ちし日差しの\n　温もりを知る",
  "月影の\n　照らす水面に\n　映る星\n　心静かに\n　明日を想えば",
  "朝露の\n　光を集め\n　輝きて\n　新たな道の\n　始まりを告ぐ",
  "山深き\n　谷間に響く\n　鳥の声\n　迷いし心に\n　光差し込む",
  "波打ちて\n　寄せては返す\n　海の如く\n　巡る運命の\n　流れに身を任す",
  "秋の野に\n　咲く花一つ\n　凛として\n　己の道を\n　静かに歩む",
  "冬枯れの\n　梢の先に\n　春を待つ\n　蕾のごとく\n　希望を抱け",
  "夕暮れに\n　染まる空見て\n　思うこと\n　明日もまたと\n　信じて生きる",
  "風そよぐ\n　竹林の奥\n　静けさに\n　答えは既に\n　己の中に",
  "雪解けの\n　水の流れに\n　身を委ね\n　やがて大河と\n　なる日を想う",
  "星空の\n　下に佇み\n　願うこと\n　天の導きを\n　信じて進め",
  "桜散る\n　風の中にも\n　美しさ\n　終わりと始まり\n　表裏一体"
];

let currentResult = null;

// Date-based seed for daily consistency
function getDaySeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

// Simple seeded random (mulberry32)
function seededRandom(seed) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// Pick fortune level based on weighted probability
function pickFortuneLevel(seed) {
  const rand = seededRandom(seed) * 100;
  let cumulative = 0;
  for (const level of FORTUNE_LEVELS) {
    cumulative += level.weight;
    if (rand < cumulative) return level;
  }
  return FORTUNE_LEVELS[FORTUNE_LEVELS.length - 1];
}

// Pick item from array using seed
function pickFromArray(arr, seed) {
  const index = Math.floor(seededRandom(seed) * arr.length);
  return arr[index];
}

// Generate full fortune
function generateFortune() {
  const baseSeed = getDaySeed();

  // Check localStorage for today's result
  const storageKey = 'celestia_omikuji_' + baseSeed;
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    return JSON.parse(stored);
  }

  const level = pickFortuneLevel(baseSeed);

  const categories = {};
  const categoryKeys = Object.keys(CATEGORIES);
  categoryKeys.forEach((key, i) => {
    const catSeed = baseSeed * 13 + i * 7 + 3;
    categories[key] = pickFromArray(CATEGORIES[key], catSeed);
  });

  const poemSeed = baseSeed * 17 + 11;
  const poem = pickFromArray(POEMS, poemSeed);

  const result = { level, categories, poem };

  // Store in localStorage
  localStorage.setItem(storageKey, JSON.stringify(result));

  return result;
}

// Phase management
function showPhase(phaseId) {
  document.querySelectorAll('[id^="phase-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById(phaseId).classList.remove('hidden');
}

// Draw omikuji
function drawOmikuji() {
  showPhase('phase-shaking');

  setTimeout(() => {
    currentResult = generateFortune();
    renderResult(currentResult);
    showPhase('phase-result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1500);
}

// Render result
function renderResult(fortune) {
  const levelEl = document.getElementById('result-level');
  levelEl.textContent = fortune.level.label;
  levelEl.className = 'omikuji-result__level ' + fortune.level.cssClass;

  const categoriesEl = document.getElementById('result-categories');
  categoriesEl.innerHTML = '';
  for (const [label, text] of Object.entries(fortune.categories)) {
    const row = document.createElement('div');
    row.className = 'omikuji-category';
    row.innerHTML = `
      <span class="omikuji-category__label">${label}</span>
      <span class="omikuji-category__text">${text}</span>
    `;
    categoriesEl.appendChild(row);
  }

  const poemEl = document.getElementById('result-poem');
  poemEl.textContent = fortune.poem;
}

// Reset
function resetOmikuji() {
  currentResult = null;
  // Clear today's stored result so user can draw again
  const baseSeed = getDaySeed();
  const storageKey = 'celestia_omikuji_' + baseSeed;
  localStorage.removeItem(storageKey);
  showPhase('phase-draw');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Share
function shareTwitter() {
  if (!currentResult) return;
  const text = encodeURIComponent(`x-TENのおみくじで「${currentResult.level.label}」が出ました！\n今日の運勢をチェック\n`);
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareLine() {
  if (!currentResult) return;
  const text = encodeURIComponent(`x-TENのおみくじで「${currentResult.level.label}」が出ました！今日の運勢をチェック`);
  window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
}
