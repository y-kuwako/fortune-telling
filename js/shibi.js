// ========================================
// 紫微斗数 計算モジュール
// ES Module - shibi.js
// HACK層: 宮位計算と日常最適化
// ========================================

// --- 十四主星 ---
export const MAIN_STARS_ZIWEI = [
  { name: "紫微", nature: "帝王", trait: "リーダーシップと統率力", element: "土" },
  { name: "天機", nature: "智慧", trait: "知性と計画力", element: "木" },
  { name: "太陽", nature: "光明", trait: "積極性と公明正大さ", element: "火" },
  { name: "武曲", nature: "財星", trait: "決断力と財務能力", element: "金" },
  { name: "天同", nature: "福星", trait: "温和さと楽観性", element: "水" },
  { name: "廉貞", nature: "次桃花", trait: "情熱と美的感覚", element: "火" },
  { name: "天府", nature: "令星", trait: "安定志向と管理能力", element: "土" },
  { name: "太陰", nature: "富星", trait: "繊細さと蓄財力", element: "水" },
  { name: "貪狼", nature: "桃花", trait: "社交力と多才さ", element: "木" },
  { name: "巨門", nature: "暗星", trait: "分析力と弁舌", element: "水" },
  { name: "天相", nature: "印星", trait: "協調性と補佐力", element: "水" },
  { name: "天梁", nature: "蔭星", trait: "包容力と教導力", element: "土" },
  { name: "七殺", nature: "将星", trait: "行動力と開拓精神", element: "金" },
  { name: "破軍", nature: "耗星", trait: "変革力と冒険心", element: "水" }
];

// --- 十二宮 ---
export const TWELVE_PALACES = [
  { name: "命宮", aspect: "本質・性格", desc: "あなたの根本的な性格と人生テーマ" },
  { name: "兄弟宮", aspect: "兄弟・同僚", desc: "兄弟姉妹や同僚との関係" },
  { name: "夫妻宮", aspect: "パートナー", desc: "恋愛・結婚・パートナーシップ" },
  { name: "子女宮", aspect: "子ども・創造", desc: "子どもとの関係と創造性" },
  { name: "財帛宮", aspect: "財運・収入", desc: "お金の稼ぎ方と使い方" },
  { name: "疾厄宮", aspect: "健康・体質", desc: "体質的な傾向と健康リスク" },
  { name: "遷移宮", aspect: "外出・旅行", desc: "社会での評価と活動範囲" },
  { name: "奴僕宮", aspect: "部下・友人", desc: "部下や友人との関係" },
  { name: "官禄宮", aspect: "仕事・キャリア", desc: "適職とキャリアパス" },
  { name: "田宅宮", aspect: "不動産・家庭", desc: "住環境と家庭生活" },
  { name: "福徳宮", aspect: "精神・趣味", desc: "精神的充足と趣味" },
  { name: "父母宮", aspect: "両親・上司", desc: "親や上司との関係" }
];

// --- 命宮の計算（簡易版） ---
export function calcMingGong(birthMonth, birthHour) {
  // 命宮 = 寅宮(2) + 月数 - 時支
  // 時支不明の場合は午(6)をデフォルト
  const hour = birthHour !== null && birthHour !== undefined
    ? (birthHour === 23 || birthHour === 0 ? 0 : Math.ceil(birthHour / 2))
    : 6;
  const index = ((2 + birthMonth - 1 - hour) % 12 + 12) % 12;
  return {
    palace: TWELVE_PALACES[0],
    position: index,
    positionName: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"][index]
  };
}

// --- 紫微星の位置計算（簡易版） ---
export function calcZiweiPosition(birthDay) {
  // 紫微星の位置は生日から算出（簡易テーブル）
  const pos = ((birthDay + 1) % 12);
  return pos;
}

// --- 各宮の主星配置（簡易版） ---
export function calcPalaceStars(birthYear, birthMonth, birthDay, birthHour) {
  const mingGong = calcMingGong(birthMonth, birthHour);
  const ziweiPos = calcZiweiPosition(birthDay);

  const palaces = TWELVE_PALACES.map((palace, i) => {
    const actualPos = (mingGong.position + i) % 12;
    // 簡易的に主星を割り当て
    const starIndex = (ziweiPos + i * 3 + birthDay) % MAIN_STARS_ZIWEI.length;
    const star = MAIN_STARS_ZIWEI[starIndex];

    return {
      palace,
      position: actualPos,
      mainStar: star
    };
  });

  return { mingGong, palaces };
}

// --- 今日の宮位活性度 ---
export function calcDailyPalaceEnergy(palaces) {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const seed = dayOfYear * 7 + today.getFullYear();

  function seededRandom(s) {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  }

  return palaces.map((p, i) => {
    const energy = Math.round(seededRandom(seed + i * 13) * 40 + 40); // 40-80
    return {
      ...p,
      dailyEnergy: energy,
      isActive: energy >= 65,
      isWeak: energy < 45
    };
  });
}

// --- 時間帯別の集中力・対人運（HACK層の核心） ---
export function calcHourlyOptimization(palaces, birthDay) {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));

  function seededRandom(s) {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  }

  const seed = dayOfYear * 31 + birthDay;

  // 6つの時間帯に分割
  const timeSlots = [
    { label: "早朝", range: "5:00-8:00", hours: [5, 6, 7] },
    { label: "午前", range: "8:00-12:00", hours: [8, 9, 10, 11] },
    { label: "昼", range: "12:00-14:00", hours: [12, 13] },
    { label: "午後", range: "14:00-17:00", hours: [14, 15, 16] },
    { label: "夕方", range: "17:00-20:00", hours: [17, 18, 19] },
    { label: "夜", range: "20:00-24:00", hours: [20, 21, 22, 23] }
  ];

  return timeSlots.map((slot, i) => {
    const concentration = Math.round(seededRandom(seed + i * 7) * 50 + 30);
    const social = Math.round(seededRandom(seed + i * 11 + 3) * 50 + 30);
    const creativity = Math.round(seededRandom(seed + i * 17 + 5) * 50 + 30);

    return {
      ...slot,
      concentration,
      social,
      creativity,
      bestFor: concentration >= social && concentration >= creativity
        ? "集中作業" : social >= creativity ? "対人・会議" : "企画・創造"
    };
  });
}

// --- 今日のTODOリスト生成 ---
export function generateDailyTodos(hourlyData, palaceData) {
  const todos = [];
  const today = new Date();
  const dayOfWeek = today.getDay();

  // 最も集中力が高い時間帯を特定
  const bestConcentration = hourlyData.reduce((best, slot) =>
    slot.concentration > best.concentration ? slot : best, hourlyData[0]);

  // 最も対人運が高い時間帯を特定
  const bestSocial = hourlyData.reduce((best, slot) =>
    slot.social > best.social ? slot : best, hourlyData[0]);

  // 最も創造性が高い時間帯を特定
  const bestCreativity = hourlyData.reduce((best, slot) =>
    slot.creativity > best.creativity ? slot : best, hourlyData[0]);

  // 集中力が低い時間帯を特定
  const worstConcentration = hourlyData.reduce((worst, slot) =>
    slot.concentration < worst.concentration ? slot : worst, hourlyData[0]);

  todos.push({
    priority: "high",
    time: bestConcentration.range,
    action: `重要な資料作成・分析作業は${bestConcentration.label}（${bestConcentration.range}）に集中`,
    reason: `集中力が${bestConcentration.concentration}%でピーク`
  });

  todos.push({
    priority: "high",
    time: bestSocial.range,
    action: `重要な会議・商談は${bestSocial.label}（${bestSocial.range}）に設定`,
    reason: `対人運が${bestSocial.social}%で最高`
  });

  todos.push({
    priority: "medium",
    time: bestCreativity.range,
    action: `アイデア出し・企画は${bestCreativity.label}（${bestCreativity.range}）が最適`,
    reason: `創造力が${bestCreativity.creativity}%`
  });

  todos.push({
    priority: "low",
    time: worstConcentration.range,
    action: `${worstConcentration.label}（${worstConcentration.range}）はルーティン作業に充てる`,
    reason: `集中力が${worstConcentration.concentration}%と低め。重要判断は避けて`
  });

  // 活性化している宮に基づくアドバイス
  const activePalaces = palaceData.filter(p => p.isActive);
  if (activePalaces.length > 0) {
    const topPalace = activePalaces[0];
    todos.push({
      priority: "medium",
      time: "終日",
      action: `${topPalace.palace.aspect}に関する活動が好調（${topPalace.palace.desc}）`,
      reason: `${topPalace.mainStar.name}（${topPalace.mainStar.nature}）の活性化`
    });
  }

  return todos;
}

// --- HACK層の統合計算 ---
export function calcHackLayer(birthYear, birthMonth, birthDay, birthHour) {
  const { mingGong, palaces } = calcPalaceStars(birthYear, birthMonth, birthDay, birthHour);
  const dailyPalaces = calcDailyPalaceEnergy(palaces);
  const hourlyOpt = calcHourlyOptimization(palaces, birthDay);
  const todos = generateDailyTodos(hourlyOpt, dailyPalaces);

  // 今日の総合スコア
  const avgEnergy = Math.round(dailyPalaces.reduce((sum, p) => sum + p.dailyEnergy, 0) / dailyPalaces.length);

  // カテゴリ別スコア
  const concentrationScore = Math.round(hourlyOpt.reduce((sum, s) => sum + s.concentration, 0) / hourlyOpt.length);
  const socialScore = Math.round(hourlyOpt.reduce((sum, s) => sum + s.social, 0) / hourlyOpt.length);
  const creativityScore = Math.round(hourlyOpt.reduce((sum, s) => sum + s.creativity, 0) / hourlyOpt.length);

  return {
    mingGong,
    dailyPalaces,
    hourlyOptimization: hourlyOpt,
    todos,
    scores: {
      overall: avgEnergy,
      concentration: concentrationScore,
      social: socialScore,
      creativity: creativityScore
    }
  };
}
