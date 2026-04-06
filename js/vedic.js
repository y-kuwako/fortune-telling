// ========================================
// インド占星術 計算モジュール (Enhanced)
// ES Module - vedic.js
// ========================================

// --- ナクシャトラ (27 Lunar Mansions) ---
export const NAKSHATRAS = [
  { name: "アシュヴィニー", deity: "アシュヴィン双神", symbol: "🐴", ruler: "ケートゥ", trait: "治癒力と迅速な行動力に恵まれています", quality: "活動的・冒険好き", guna: "サットヴァ", aim: "ダルマ" },
  { name: "バラニー", deity: "ヤマ", symbol: "🐘", ruler: "金星", trait: "強い意志と変容の力を持っています", quality: "忍耐強い・献身的", guna: "ラジャス", aim: "アルタ" },
  { name: "クリッティカー", deity: "アグニ", symbol: "🔥", ruler: "太陽", trait: "鋭い知性と浄化の力を持っています", quality: "鋭敏・リーダー気質", guna: "サットヴァ", aim: "カーマ" },
  { name: "ローヒニー", deity: "ブラフマー", symbol: "🌹", ruler: "月", trait: "創造性と美的感覚に優れています", quality: "魅力的・芸術的", guna: "ラジャス", aim: "モークシャ" },
  { name: "ムリガシーラ", deity: "ソーマ", symbol: "🦌", ruler: "火星", trait: "探究心と繊細な感性の持ち主です", quality: "探究的・知的好奇心", guna: "タマス", aim: "モークシャ" },
  { name: "アールドラー", deity: "ルドラ", symbol: "💎", ruler: "ラーフ", trait: "変革と再生の力を秘めています", quality: "情熱的・変革者", guna: "サットヴァ", aim: "カーマ" },
  { name: "プナルヴァス", deity: "アディティ", symbol: "🏹", ruler: "木星", trait: "再生と回復の力に恵まれています", quality: "楽観的・寛大", guna: "ラジャス", aim: "アルタ" },
  { name: "プシュヤ", deity: "ブリハスパティ", symbol: "🌸", ruler: "土星", trait: "養育と保護の力を持っています", quality: "慈悲深い・教育的", guna: "タマス", aim: "ダルマ" },
  { name: "アーシュレーシャ", deity: "ナーガ", symbol: "🐍", ruler: "水星", trait: "深い知恵と神秘的な直感があります", quality: "洞察力・神秘的", guna: "サットヴァ", aim: "ダルマ" },
  { name: "マガー", deity: "ピトリ", symbol: "👑", ruler: "ケートゥ", trait: "王者の風格と権威を持っています", quality: "高貴・伝統重視", guna: "ラジャス", aim: "アルタ" },
  { name: "プールヴァ・パルグニー", deity: "バガ", symbol: "🎭", ruler: "金星", trait: "芸術的才能と享楽の才があります", quality: "創造的・社交的", guna: "タマス", aim: "カーマ" },
  { name: "ウッタラ・パルグニー", deity: "アリヤマン", symbol: "🤝", ruler: "太陽", trait: "友情と契約の力に恵まれています", quality: "誠実・協力的", guna: "サットヴァ", aim: "モークシャ" },
  { name: "ハスタ", deity: "サヴィトリ", symbol: "✋", ruler: "月", trait: "巧みな技術と実行力があります", quality: "器用・実践的", guna: "ラジャス", aim: "モークシャ" },
  { name: "チトラー", deity: "トヴァシュトリ", symbol: "💫", ruler: "火星", trait: "美と創造のエネルギーに満ちています", quality: "魅力的・独創的", guna: "タマス", aim: "カーマ" },
  { name: "スヴァーティー", deity: "ヴァーユ", symbol: "🍃", ruler: "ラーフ", trait: "自由と独立の精神に溢れています", quality: "独立心・柔軟", guna: "サットヴァ", aim: "アルタ" },
  { name: "ヴィシャーカー", deity: "インドラ・アグニ", symbol: "🌳", ruler: "木星", trait: "強い目的意識と達成力があります", quality: "決意・集中力", guna: "ラジャス", aim: "ダルマ" },
  { name: "アヌラーダー", deity: "ミトラ", symbol: "🌺", ruler: "土星", trait: "友愛と献身の力を持っています", quality: "親しみやすい・献身的", guna: "タマス", aim: "ダルマ" },
  { name: "ジェーシュター", deity: "インドラ", symbol: "⭐", ruler: "水星", trait: "守護とリーダーシップの力があります", quality: "保護的・責任感", guna: "サットヴァ", aim: "アルタ" },
  { name: "ムーラ", deity: "ニルリティ", symbol: "🌿", ruler: "ケートゥ", trait: "根源的な真理を探究する力があります", quality: "探究的・根本的", guna: "ラジャス", aim: "カーマ" },
  { name: "プールヴァ・アシャーダー", deity: "アパス", symbol: "🌊", ruler: "金星", trait: "不敗のエネルギーと浄化力があります", quality: "自信・活力", guna: "タマス", aim: "モークシャ" },
  { name: "ウッタラ・アシャーダー", deity: "ヴィシュヴェーデーヴァ", symbol: "🏔️", ruler: "太陽", trait: "最終的な勝利と普遍的な力を持っています", quality: "リーダー・普遍的", guna: "サットヴァ", aim: "モークシャ" },
  { name: "シュラヴァナ", deity: "ヴィシュヌ", symbol: "👂", ruler: "月", trait: "傾聴力と学びの力に優れています", quality: "学習力・広い視野", guna: "ラジャス", aim: "カーマ" },
  { name: "ダニシュター", deity: "ヴァス", symbol: "🥁", ruler: "火星", trait: "富と名声を引き寄せる力があります", quality: "野心的・音楽的", guna: "タマス", aim: "ダルマ" },
  { name: "シャタビシャ", deity: "ヴァルナ", symbol: "💧", ruler: "ラーフ", trait: "癒しと秘密の知識を持っています", quality: "癒し・神秘的", guna: "サットヴァ", aim: "ダルマ" },
  { name: "プールヴァ・バードラパダー", deity: "アジャ・エーカパード", symbol: "🔱", ruler: "木星", trait: "霊的な力と変容のエネルギーがあります", quality: "情熱的・理想主義", guna: "ラジャス", aim: "アルタ" },
  { name: "ウッタラ・バードラパダー", deity: "アヒル・ブドニャ", symbol: "🐉", ruler: "土星", trait: "深い知恵と精神的安定を持っています", quality: "賢明・安定", guna: "タマス", aim: "カーマ" },
  { name: "レーヴァティー", deity: "プーシャン", symbol: "🐟", ruler: "水星", trait: "養育と旅の守護を受けています", quality: "慈悲深い・直感的", guna: "サットヴァ", aim: "モークシャ" }
];

// --- ラーシ (12 Zodiac Signs / 星座) ---
export const RASHIS = [
  { name: "メーシャ", nameEn: "Aries", jaName: "牡羊座", ruler: "火星", element: "火", quality: "活動" },
  { name: "ヴリシャバ", nameEn: "Taurus", jaName: "牡牛座", ruler: "金星", element: "地", quality: "不動" },
  { name: "ミトゥナ", nameEn: "Gemini", jaName: "双子座", ruler: "水星", element: "風", quality: "変通" },
  { name: "カルカ", nameEn: "Cancer", jaName: "蟹座", ruler: "月", element: "水", quality: "活動" },
  { name: "シンハ", nameEn: "Leo", jaName: "獅子座", ruler: "太陽", element: "火", quality: "不動" },
  { name: "カンニャー", nameEn: "Virgo", jaName: "乙女座", ruler: "水星", element: "地", quality: "変通" },
  { name: "トゥラー", nameEn: "Libra", jaName: "天秤座", ruler: "金星", element: "風", quality: "活動" },
  { name: "ヴリシュチカ", nameEn: "Scorpio", jaName: "蠍座", ruler: "火星", element: "水", quality: "不動" },
  { name: "ダヌス", nameEn: "Sagittarius", jaName: "射手座", ruler: "木星", element: "火", quality: "変通" },
  { name: "マカラ", nameEn: "Capricorn", jaName: "山羊座", ruler: "土星", element: "地", quality: "活動" },
  { name: "クンバ", nameEn: "Aquarius", jaName: "水瓶座", ruler: "土星", element: "風", quality: "不動" },
  { name: "ミーナ", nameEn: "Pisces", jaName: "魚座", ruler: "木星", element: "水", quality: "変通" }
];

// --- ナクシャトラ計算 ---
// 簡易計算: 月日からナクシャトラを近似（本来は月の黄経位置から算出）
export function calcNakshatra(month, day) {
  const dayOfYear = (month - 1) * 30 + day;
  const index = dayOfYear % 27;
  return {
    nakshatra: NAKSHATRAS[index],
    index: index,
    pada: (dayOfYear % 4) + 1 // パダ（4分の1区分）
  };
}

// --- ラーシ（太陽星座）計算 ---
// 西洋占星術と約23日ずれる（アヤナームシャ補正の簡易版）
const RASHI_DATES = [
  { month: 4, day: 14 },  // メーシャ 4/14-
  { month: 5, day: 15 },  // ヴリシャバ 5/15-
  { month: 6, day: 15 },  // ミトゥナ 6/15-
  { month: 7, day: 16 },  // カルカ 7/16-
  { month: 8, day: 17 },  // シンハ 8/17-
  { month: 9, day: 17 },  // カンニャー 9/17-
  { month: 10, day: 17 }, // トゥラー 10/17-
  { month: 11, day: 16 }, // ヴリシュチカ 11/16-
  { month: 12, day: 16 }, // ダヌス 12/16-
  { month: 1, day: 14 },  // マカラ 1/14-
  { month: 2, day: 13 },  // クンバ 2/13-
  { month: 3, day: 15 }   // ミーナ 3/15-
];

export function calcRashi(month, day) {
  // 日付をラーシ境界と比較
  let rashiIndex = 11; // デフォルト: ミーナ
  for (let i = 0; i < RASHI_DATES.length; i++) {
    const current = RASHI_DATES[i];
    const next = RASHI_DATES[(i + 1) % 12];

    if (current.month <= next.month) {
      if ((month === current.month && day >= current.day) ||
          (month > current.month && month < next.month) ||
          (month === next.month && day < next.day)) {
        rashiIndex = i;
        break;
      }
    } else {
      // 年をまたぐケース（ダヌス12月→マカラ1月等）
      if ((month === current.month && day >= current.day) ||
          (month > current.month) ||
          (month < next.month) ||
          (month === next.month && day < next.day)) {
        rashiIndex = i;
        break;
      }
    }
  }

  return RASHIS[rashiIndex];
}

// --- ナクシャトラ支配星のダシャー（惑星期間）順序 ---
const DASHA_ORDER = ["ケートゥ", "金星", "太陽", "月", "火星", "ラーフ", "木星", "土星", "水星"];
const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17]; // 各惑星のダシャー期間（年）

export function calcCurrentDasha(birthYear, birthMonth, birthDay) {
  const nakshatraResult = calcNakshatra(birthMonth, birthDay);
  const startRuler = nakshatraResult.nakshatra.ruler;
  const startIndex = DASHA_ORDER.indexOf(startRuler);

  // 出生時の年齢からダシャー期間を追跡
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  let elapsed = 0;
  let dashaIndex = startIndex;
  // パダに基づく初期ダシャーの消化済み期間（簡易計算）
  const initialConsumed = (nakshatraResult.pada / 4) * DASHA_YEARS[dashaIndex];
  elapsed += DASHA_YEARS[dashaIndex] - initialConsumed;

  if (age <= elapsed) {
    return {
      ruler: DASHA_ORDER[dashaIndex],
      years: DASHA_YEARS[dashaIndex],
      remaining: Math.round(elapsed - age),
      period: `${birthYear}〜${birthYear + Math.round(elapsed)}年`
    };
  }

  dashaIndex = (dashaIndex + 1) % 9;
  while (elapsed + DASHA_YEARS[dashaIndex] < age) {
    elapsed += DASHA_YEARS[dashaIndex];
    dashaIndex = (dashaIndex + 1) % 9;
  }

  const periodStart = birthYear + Math.round(elapsed);
  const periodEnd = periodStart + DASHA_YEARS[dashaIndex];

  return {
    ruler: DASHA_ORDER[dashaIndex],
    years: DASHA_YEARS[dashaIndex],
    remaining: periodEnd - currentYear,
    period: `${periodStart}〜${periodEnd}年`
  };
}

// --- ヴェーダ占星術の統合計算 ---
export function calcVedicAstrology(year, month, day) {
  const nakshatraResult = calcNakshatra(month, day);
  const rashi = calcRashi(month, day);
  const dasha = calcCurrentDasha(year, month, day);

  return {
    nakshatra: nakshatraResult.nakshatra,
    nakshatraIndex: nakshatraResult.index,
    pada: nakshatraResult.pada,
    rashi: rashi,
    dasha: dasha
  };
}
