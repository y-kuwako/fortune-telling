// ========================================
// 四柱推命 計算モジュール (Enhanced)
// ES Module - pillars.js
// ========================================

// --- 天干 (10 Heavenly Stems) ---
export const HEAVENLY_STEMS = [
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

// --- 地支 (12 Earthly Branches) ---
export const EARTHLY_BRANCHES = [
  { name: "子", animal: "鼠", element: "水", hours: "23:00-01:00" },
  { name: "丑", animal: "牛", element: "土", hours: "01:00-03:00" },
  { name: "寅", animal: "虎", element: "木", hours: "03:00-05:00" },
  { name: "卯", animal: "兎", element: "木", hours: "05:00-07:00" },
  { name: "辰", animal: "龍", element: "土", hours: "07:00-09:00" },
  { name: "巳", animal: "蛇", element: "火", hours: "09:00-11:00" },
  { name: "午", animal: "馬", element: "火", hours: "11:00-13:00" },
  { name: "未", animal: "羊", element: "土", hours: "13:00-15:00" },
  { name: "申", animal: "猿", element: "金", hours: "15:00-17:00" },
  { name: "酉", animal: "鶏", element: "金", hours: "17:00-19:00" },
  { name: "戌", animal: "犬", element: "土", hours: "19:00-21:00" },
  { name: "亥", animal: "猪", element: "水", hours: "21:00-23:00" }
];

// --- 五行 (Five Elements) ---
export const FIVE_ELEMENTS = {
  "木": { color: "グリーン", season: "春", direction: "東", organ: "肝", emotion: "怒", symbol: "🌿", generates: "火", overcomes: "土" },
  "火": { color: "レッド", season: "夏", direction: "南", organ: "心", emotion: "喜", symbol: "🔥", generates: "土", overcomes: "金" },
  "土": { color: "イエロー", season: "土用", direction: "中央", organ: "脾", emotion: "思", symbol: "🏔️", generates: "金", overcomes: "水" },
  "金": { color: "ホワイト", season: "秋", direction: "西", organ: "肺", emotion: "悲", symbol: "⚔️", generates: "水", overcomes: "木" },
  "水": { color: "ブルー", season: "冬", direction: "北", organ: "腎", emotion: "恐", symbol: "💧", generates: "木", overcomes: "火" }
};

// --- 六十甲子テーブル (Sexagenary Cycle) ---
// 日柱計算用の基準日からのオフセット
// 基準日: 1900年1月1日 = 甲子(0)からのオフセット
const SEXAGENARY_BASE_DATE = new Date(1900, 0, 1); // 1900-01-01
const SEXAGENARY_BASE_OFFSET = 0; // 1900-01-01 は 庚子 = index 36 ではなく、実際は甲戌(10)
// 正確な基準: 1900年1月1日の干支番号は10（甲戌）
const BASE_GANSHI_INDEX = 10;

// --- 年柱計算 ---
export function calcYearPillar(year) {
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    label: `${HEAVENLY_STEMS[stemIndex].name}${EARTHLY_BRANCHES[branchIndex].name}`
  };
}

// --- 月柱計算 ---
// 月干は年干から導出（五虎遁月法）
export function calcMonthPillar(year, month) {
  const yearStemIndex = (year - 4) % 10;
  // 五虎遁月法: 年干の陽干インデックス(0,2,4,6,8) → 月干の起算点
  const monthStemStart = (yearStemIndex % 5) * 2;
  const stemIndex = (monthStemStart + (month - 1)) % 10;
  // 月支は寅月(1月=寅)から固定
  const branchIndex = (month + 1) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    label: `${HEAVENLY_STEMS[stemIndex].name}${EARTHLY_BRANCHES[branchIndex].name}`
  };
}

// --- 日柱計算 ---
// グレゴリオ暦の日付から六十甲子のインデックスを算出
export function calcDayPillar(year, month, day) {
  const targetDate = new Date(year, month - 1, day);
  const diffMs = targetDate.getTime() - SEXAGENARY_BASE_DATE.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const ganshiIndex = ((diffDays + BASE_GANSHI_INDEX) % 60 + 60) % 60;
  const stemIndex = ganshiIndex % 10;
  const branchIndex = ganshiIndex % 12;
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    label: `${HEAVENLY_STEMS[stemIndex].name}${EARTHLY_BRANCHES[branchIndex].name}`
  };
}

// --- 時柱計算 ---
// 出生時刻から時支を求め、日干から時干を導出（五鼠遁時法）
export function calcHourPillar(year, month, day, hour) {
  if (hour === null || hour === undefined) return null;

  // 時支: 2時間ごとに1つの地支（子の刻=23-1時）
  // 23時・0時 = 子(0), 1-2時 = 丑(1), 3-4時 = 寅(2), ...
  let branchIndex;
  if (hour === 23 || hour === 0) {
    branchIndex = 0;
  } else {
    branchIndex = Math.ceil(hour / 2);
  }

  // 五鼠遁時法: 日干から時干の起算点を求める
  const dayPillar = calcDayPillar(year, month, day);
  const dayStemIndex = HEAVENLY_STEMS.indexOf(dayPillar.stem);
  const hourStemStart = (dayStemIndex % 5) * 2;
  const stemIndex = (hourStemStart + branchIndex) % 10;

  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    label: `${HEAVENLY_STEMS[stemIndex].name}${EARTHLY_BRANCHES[branchIndex].name}`
  };
}

// --- 五行バランス計算 ---
// 四柱すべての天干・地支の五行を集計
export function calcElementBalance(pillars) {
  const balance = { "木": 0, "火": 0, "土": 0, "金": 0, "水": 0 };

  pillars.forEach(pillar => {
    if (!pillar) return;
    // 天干の五行（主気）
    balance[pillar.stem.element] += 2;
    // 地支の五行（支気）
    balance[pillar.branch.element] += 1;
  });

  // 百分率に正規化
  const total = Object.values(balance).reduce((a, b) => a + b, 0);
  const normalized = {};
  for (const [key, val] of Object.entries(balance)) {
    normalized[key] = total > 0 ? Math.round((val / total) * 100) : 0;
  }
  return normalized;
}

// --- 通変星（十神）計算 ---
// 日干を基準に他の天干との関係を算出
const TEN_GODS = [
  "比肩", "劫財", "食神", "傷官", "偏財",
  "正財", "偏官", "正官", "偏印", "印綬"
];

export function calcTenGod(dayStem, targetStem) {
  const dayIndex = HEAVENLY_STEMS.indexOf(dayStem);
  const targetIndex = HEAVENLY_STEMS.indexOf(targetStem);
  const diff = ((targetIndex - dayIndex) % 10 + 10) % 10;
  return TEN_GODS[diff];
}

// --- 空亡（天中殺）計算 ---
// 日柱の六十甲子番号から空亡の地支2つを求める
export function calcKuuBou(year, month, day) {
  const dayPillar = calcDayPillar(year, month, day);
  const dayGanshi = HEAVENLY_STEMS.indexOf(dayPillar.stem) +
    EARTHLY_BRANCHES.indexOf(dayPillar.branch) * 0; // 再計算
  const targetDate = new Date(year, month - 1, day);
  const diffMs = targetDate.getTime() - SEXAGENARY_BASE_DATE.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const ganshiIndex = ((diffDays + BASE_GANSHI_INDEX) % 60 + 60) % 60;

  // 空亡: 六十甲子を10日ごとのグループに分け、そのグループで使われない地支2つ
  const groupStart = Math.floor(ganshiIndex / 10) * 10;
  const startBranch = groupStart % 12;
  // 10干に対して12支のうち余る2つが空亡
  const kuubou1 = EARTHLY_BRANCHES[(startBranch + 10) % 12];
  const kuubou2 = EARTHLY_BRANCHES[(startBranch + 11) % 12];
  return [kuubou1, kuubou2];
}

// --- 四柱すべてを一括計算 ---
export function calcFourPillars(year, month, day, hour = null) {
  const yearPillar = calcYearPillar(year);
  const monthPillar = calcMonthPillar(year, month);
  const dayPillar = calcDayPillar(year, month, day);
  const hourPillar = calcHourPillar(year, month, day, hour);

  const allPillars = [yearPillar, monthPillar, dayPillar, hourPillar].filter(Boolean);
  const elementBalance = calcElementBalance(allPillars);

  // 日干（命主の本質）
  const dayStem = dayPillar.stem;

  // 通変星
  const tenGods = {};
  if (yearPillar) tenGods.year = calcTenGod(dayStem, yearPillar.stem);
  if (monthPillar) tenGods.month = calcTenGod(dayStem, monthPillar.stem);
  if (hourPillar) tenGods.hour = calcTenGod(dayStem, hourPillar.stem);

  // 空亡
  const kuubou = calcKuuBou(year, month, day);

  // 主要五行（日干の五行）
  const dominantElement = dayStem.element;

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    elementBalance,
    dominantElement,
    dayStem,
    tenGods,
    kuubou,
    elementInfo: FIVE_ELEMENTS[dominantElement],
    hasHourPillar: hourPillar !== null
  };
}
