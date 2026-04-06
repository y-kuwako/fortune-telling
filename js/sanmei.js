// ========================================
// 算命学 計算モジュール
// ES Module - sanmei.js
// FLOW層: 大運・年運・天中殺の計算
// ========================================

// --- 十大主星（性格星） ---
export const MAIN_STARS = [
  { name: "貫索星", element: "木陽", trait: "自立心が強く、独自の道を歩む", keyword: "独立・頑固" },
  { name: "石門星", element: "木陰", trait: "協調性があり、人を集める力がある", keyword: "社交・協力" },
  { name: "鳳閣星", element: "火陽", trait: "楽観的で表現力に富む", keyword: "表現・楽天" },
  { name: "調舒星", element: "火陰", trait: "感受性が鋭く、芸術的才能がある", keyword: "感性・孤独" },
  { name: "禄存星", element: "土陽", trait: "人を引きつける魅力と回転財を持つ", keyword: "魅力・財運" },
  { name: "司禄星", element: "土陰", trait: "堅実で蓄財の才能がある", keyword: "堅実・蓄財" },
  { name: "車騎星", element: "金陽", trait: "行動力があり、スピード感がある", keyword: "行動・攻撃" },
  { name: "牽牛星", element: "金陰", trait: "名誉欲が強く、責任感がある", keyword: "名誉・責任" },
  { name: "龍高星", element: "水陽", trait: "知識欲が旺盛で、改革精神がある", keyword: "改革・放浪" },
  { name: "玉堂星", element: "水陰", trait: "学習能力が高く、伝統を重んじる", keyword: "学問・伝統" }
];

// --- 十二大従星（エネルギー値） ---
export const ENERGY_STARS = [
  { name: "天報星", energy: 3, phase: "胎児", trait: "変化を好む多才な時期" },
  { name: "天印星", energy: 6, phase: "赤子", trait: "周囲に愛される無邪気な時期" },
  { name: "天貴星", energy: 9, phase: "幼児", trait: "プライドが高く品がある時期" },
  { name: "天恍星", energy: 7, phase: "少年", trait: "夢多き不安定な時期" },
  { name: "天南星", energy: 10, phase: "青年", trait: "エネルギー最大の闘争の時期" },
  { name: "天禄星", energy: 11, phase: "壮年", trait: "安定と実力の充実期" },
  { name: "天将星", energy: 12, phase: "頂点", trait: "最強のリーダーシップの時期" },
  { name: "天堂星", energy: 8, phase: "老人", trait: "経験と知恵の成熟期" },
  { name: "天胡星", energy: 4, phase: "病人", trait: "感受性が鋭い繊細な時期" },
  { name: "天極星", energy: 2, phase: "死人", trait: "精神的覚醒と悟りの時期" },
  { name: "天庫星", energy: 5, phase: "入墓", trait: "蓄積と集約の時期" },
  { name: "天馳星", energy: 1, phase: "あの世", trait: "瞬発力とスピードの時期" }
];

// --- 天中殺（12種類、2年ずつ） ---
const TENCHUSATSU_GROUPS = [
  { name: "子丑天中殺", branches: ["子", "丑"], trait: "初代運。家系の恩恵が薄い分、自力で道を切り開く力が強い。", period: "北方が不安定" },
  { name: "寅卯天中殺", branches: ["寅", "卯"], trait: "社会運が不安定。既存組織より独立・起業向き。", period: "東方が不安定" },
  { name: "辰巳天中殺", branches: ["辰", "巳"], trait: "精神世界が豊か。現実より理想を追求する傾向。", period: "南東が不安定" },
  { name: "午未天中殺", branches: ["午", "未"], trait: "家庭運に波あり。仕事に集中すると大成功の可能性。", period: "南方が不安定" },
  { name: "申酉天中殺", branches: ["申", "酉"], trait: "行動力に波あり。計画を練ってから動くのが吉。", period: "西方が不安定" },
  { name: "戌亥天中殺", branches: ["戌", "亥"], trait: "末代運。家系を締めくくる役割。精神的に強い。", period: "北西が不安定" }
];

// --- 天中殺の計算 ---
// 日柱の干支番号から天中殺グループを特定
export function calcTenchusatsu(dayBranchIndex) {
  // 日支のインデックスに基づく簡易計算
  const groupIndex = Math.floor(dayBranchIndex / 2) % 6;
  return TENCHUSATSU_GROUPS[groupIndex];
}

// --- 天中殺の年を計算 ---
export function calcTenchusatsuYears(dayBranchIndex, startYear, endYear) {
  const group = calcTenchusatsu(dayBranchIndex);
  const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearBranchIndex = (year - 4) % 12;
    const yearBranch = BRANCHES[yearBranchIndex];
    if (group.branches.includes(yearBranch)) {
      years.push(year);
    }
  }
  return { group, years };
}

// --- 大運（10年ごとの運気サイクル）計算 ---
export function calcTaiun(birthYear, birthMonth, gender) {
  const yearStemIndex = (birthYear - 4) % 10;
  // 陽干+男性 or 陰干+女性 = 順行、それ以外 = 逆行
  const isYang = yearStemIndex % 2 === 0;
  const isMale = gender === 'male';
  const isForward = (isYang && isMale) || (!isYang && !isMale);

  // 大運の立運（開始年齢）を簡易計算
  // 実際は節入り日からの日数で計算するが、ここでは月から近似
  const startAge = Math.max(1, Math.round(Math.abs(birthMonth - (isForward ? 1 : 13)) / 3));

  const periods = [];
  const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  // 月柱を基準に大運を展開
  const monthStemStart = ((yearStemIndex % 5) * 2 + (birthMonth - 1)) % 10;
  const monthBranchStart = (birthMonth + 1) % 12;

  for (let i = 0; i < 8; i++) {
    const offset = isForward ? i + 1 : -(i + 1);
    const stemIdx = ((monthStemStart + offset) % 10 + 10) % 10;
    const branchIdx = ((monthBranchStart + offset) % 12 + 12) % 12;
    const fromAge = startAge + i * 10;
    const toAge = fromAge + 9;

    periods.push({
      stem: STEMS[stemIdx],
      branch: BRANCHES[branchIdx],
      label: `${STEMS[stemIdx]}${BRANCHES[branchIdx]}`,
      fromAge,
      toAge,
      fromYear: birthYear + fromAge,
      toYear: birthYear + toAge
    });
  }

  return { startAge, isForward, periods };
}

// --- 年運（1年ごとの干支）計算 ---
export function calcNenun(year) {
  const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const stemIdx = (year - 4) % 10;
  const branchIdx = (year - 4) % 12;
  return {
    stem: STEMS[stemIdx],
    branch: BRANCHES[branchIdx],
    label: `${STEMS[stemIdx]}${BRANCHES[branchIdx]}`
  };
}

// --- 年間エネルギーレベル予測 ---
export function calcYearlyEnergy(birthYear, birthMonth, birthDay, targetYear) {
  // 大運 + 年運 + 天中殺の影響を統合したエネルギー値(0-100)
  const dayBranchIndex = ((new Date(birthYear, birthMonth - 1, birthDay).getTime() -
    new Date(1900, 0, 1).getTime()) / (1000 * 60 * 60 * 24)) % 12;

  const tenchusatsu = calcTenchusatsuYears(Math.abs(Math.floor(dayBranchIndex)), targetYear, targetYear);
  const isTenchusatsu = tenchusatsu.years.includes(targetYear);

  // 年運の五行バランスからエネルギーを簡易算出
  const nenun = calcNenun(targetYear);
  const STEM_ENERGY = { "甲": 75, "乙": 65, "丙": 85, "丁": 70, "戊": 60, "己": 55, "庚": 80, "辛": 68, "壬": 78, "癸": 58 };
  let energy = STEM_ENERGY[nenun.stem] || 60;

  // 天中殺年はエネルギーが不安定（-15〜-25）
  if (isTenchusatsu) {
    energy = Math.max(20, energy - 20);
  }

  // 年齢による補正
  const age = targetYear - birthYear;
  if (age >= 25 && age <= 45) energy = Math.min(100, energy + 5);

  return {
    year: targetYear,
    energy: Math.round(energy),
    nenun,
    isTenchusatsu,
    label: isTenchusatsu ? "天中殺" : (energy >= 75 ? "好調期" : energy >= 50 ? "平常期" : "調整期")
  };
}

// --- FLOW層の統合計算 ---
export function calcFlowLayer(birthYear, birthMonth, birthDay, gender) {
  const currentYear = new Date().getFullYear();

  // 日支インデックス（簡易）
  const diffDays = Math.floor((new Date(birthYear, birthMonth - 1, birthDay).getTime() -
    new Date(1900, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
  const dayBranchIndex = ((diffDays + 10) % 60 + 60) % 60 % 12;

  // 天中殺
  const tenchusatsu = calcTenchusatsu(dayBranchIndex);
  const tenchusatsuYears = calcTenchusatsuYears(dayBranchIndex, currentYear, currentYear + 3);

  // 大運
  const taiun = calcTaiun(birthYear, birthMonth, gender);

  // 3年間の年間エネルギー
  const yearlyForecast = [];
  for (let y = currentYear; y <= currentYear + 2; y++) {
    const months = [];
    for (let m = 1; m <= 12; m++) {
      // 月ごとのエネルギー変動（簡易的なsin波 + 年運ベース）
      const yearE = calcYearlyEnergy(birthYear, birthMonth, birthDay, y);
      const monthVariation = Math.sin((m + birthMonth) * Math.PI / 6) * 15;
      const monthEnergy = Math.max(10, Math.min(100, Math.round(yearE.energy + monthVariation)));
      months.push({
        month: m,
        energy: monthEnergy,
        label: monthEnergy >= 75 ? "好調" : monthEnergy >= 50 ? "平常" : "注意"
      });
    }
    yearlyForecast.push({
      ...calcYearlyEnergy(birthYear, birthMonth, birthDay, y),
      months
    });
  }

  // 現在の大運期間を特定
  const age = currentYear - birthYear;
  const currentTaiun = taiun.periods.find(p => age >= p.fromAge && age <= p.toAge) || taiun.periods[0];

  return {
    tenchusatsu,
    tenchusatsuYears: tenchusatsuYears.years,
    taiun,
    currentTaiun,
    yearlyForecast,
    currentNenun: calcNenun(currentYear)
  };
}
