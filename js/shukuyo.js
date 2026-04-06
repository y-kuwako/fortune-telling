// ========================================
// 宿曜占星術 計算モジュール
// ES Module - shukuyo.js
// FLOW層: 27宿の相性・運気サイクル
// ========================================

// --- 27宿 ---
export const SHUKUYO_27 = [
  { name: "昴宿", group: "胃", element: "金", personality: "美意識が高く、センスに優れる", luck: "芸術・ファッション" },
  { name: "畢宿", group: "胃", element: "火", personality: "粘り強く、着実に成果を出す", luck: "コツコツ型の成功" },
  { name: "觜宿", group: "觜", element: "水", personality: "知的で弁が立つ、策略家", luck: "交渉・企画" },
  { name: "参宿", group: "参", element: "金", personality: "派手で目立つ存在、勝負師", luck: "一発逆転" },
  { name: "井宿", group: "井", element: "木", personality: "計画的で几帳面、完璧主義", luck: "計画的な成功" },
  { name: "鬼宿", group: "鬼", element: "金", personality: "霊感が強く、直感が鋭い", luck: "最強の運気宿" },
  { name: "柳宿", group: "柳", element: "火", personality: "情熱的で執念深い", luck: "熱意が運を開く" },
  { name: "星宿", group: "星", element: "土", personality: "華やかで人を惹きつける", luck: "人気運" },
  { name: "張宿", group: "張", element: "火", personality: "堂々とした存在感、王者", luck: "リーダー運" },
  { name: "翼宿", group: "翼", element: "金", personality: "真面目で努力家、大器晩成", luck: "晩年に花開く" },
  { name: "軫宿", group: "軫", element: "水", personality: "繊細で思いやりがある", luck: "人徳" },
  { name: "角宿", group: "角", element: "木", personality: "社交的でバランス感覚がある", luck: "人間関係" },
  { name: "亢宿", group: "亢", element: "金", personality: "プライドが高く、妥協しない", luck: "高い理想の実現" },
  { name: "氐宿", group: "氐", element: "火", personality: "外柔内剛、芯が強い", luck: "忍耐が実を結ぶ" },
  { name: "房宿", group: "房", element: "木", personality: "リーダーシップがあり、面倒見が良い", luck: "出世運" },
  { name: "心宿", group: "心", element: "火", personality: "多才で器用、移り気な面も", luck: "多方面での活躍" },
  { name: "尾宿", group: "尾", element: "火", personality: "義理人情に厚い、親分肌", luck: "人望" },
  { name: "箕宿", group: "箕", element: "木", personality: "自由奔放、束縛を嫌う", luck: "自由な生き方" },
  { name: "斗宿", group: "斗", element: "水", personality: "向上心が強く、信念を貫く", luck: "大きな目標達成" },
  { name: "女宿", group: "女", element: "土", personality: "努力家で負けず嫌い", luck: "実力勝負" },
  { name: "虚宿", group: "虚", element: "土", personality: "理想主義で夢見がち", luck: "精神的成長" },
  { name: "危宿", group: "危", element: "火", personality: "波乱万丈だが、運が強い", luck: "危機を好機に変える" },
  { name: "室宿", group: "室", element: "水", personality: "パワフルで統率力がある", luck: "事業運" },
  { name: "壁宿", group: "壁", element: "金", personality: "温厚で誠実、守りが強い", luck: "安定運" },
  { name: "奎宿", group: "奎", element: "木", personality: "品があり、知的好奇心旺盛", luck: "学術・文化" },
  { name: "婁宿", group: "婁", element: "火", personality: "お人好しで寛大、商才あり", luck: "商売繁盛" },
  { name: "胃宿", group: "胃", element: "土", personality: "負けん気が強い、開拓者", luck: "パイオニア運" }
];

// --- 宿曜の関係性（6種） ---
const RELATIONS = {
  "命": { type: "命", label: "命の関係", desc: "前世からの深い縁。自分の分身のような存在。", score: 90 },
  "業": { type: "業", label: "業の関係", desc: "カルマ的なつながり。学びを与え合う関係。", score: 60 },
  "胎": { type: "胎", label: "胎の関係", desc: "来世に続く縁。自然体でいられる安らぎの関係。", score: 85 },
  "栄": { type: "栄", label: "栄の関係", desc: "互いに発展させ合う最良の関係。", score: 95 },
  "親": { type: "親", label: "親の関係", desc: "親しみやすく、居心地が良い関係。", score: 80 },
  "友": { type: "友", label: "友の関係", desc: "対等で刺激し合える関係。", score: 75 },
  "衰": { type: "衰", label: "衰の関係", desc: "エネルギーを消耗しやすい関係。距離感が大切。", score: 40 },
  "危": { type: "危", label: "危の関係", desc: "波乱が多いが、成長のきっかけになる関係。", score: 35 },
  "成": { type: "成", label: "成の関係", desc: "ビジネスパートナーに最適。成果を出せる関係。", score: 70 },
  "壊": { type: "壊", label: "壊の関係", desc: "破壊と再生。強烈な縁だが注意が必要。", score: 25 },
  "安": { type: "安", label: "安の関係", desc: "安定しているが、マンネリに注意。", score: 65 }
};

// --- 宿の計算（生年月日から） ---
export function calcShukuyo(year, month, day) {
  // 旧暦近似による宿の算出
  // 実際は太陰暦に基づくが、簡易版として太陽暦から近似
  const baseDate = new Date(1900, 0, 1); // 基準日
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const index = ((diffDays % 27) + 27) % 27;
  return {
    shukuyo: SHUKUYO_27[index],
    index
  };
}

// --- 日運（今日の宿） ---
export function calcDailyShukuyo() {
  const today = new Date();
  const baseDate = new Date(1900, 0, 1);
  const diffDays = Math.floor((today.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  const index = ((diffDays % 27) + 27) % 27;
  return {
    shukuyo: SHUKUYO_27[index],
    index
  };
}

// --- 宿同士の相性判定 ---
export function calcShukuyoRelation(index1, index2) {
  const diff = ((index2 - index1) % 27 + 27) % 27;

  if (diff === 0) return RELATIONS["命"];
  if (diff === 1 || diff === 26) return RELATIONS["業"];
  if (diff === 2 || diff === 25) return RELATIONS["胎"];
  if (diff === 3 || diff === 24) return RELATIONS["栄"];
  if (diff === 4 || diff === 23) return RELATIONS["親"];
  if (diff === 5 || diff === 22) return RELATIONS["友"];
  if (diff === 6 || diff === 21) return RELATIONS["衰"];
  if (diff === 7 || diff === 20) return RELATIONS["危"];
  if (diff === 8 || diff === 19) return RELATIONS["成"];
  if (diff === 9 || diff === 18) return RELATIONS["壊"];
  return RELATIONS["安"];
}

// --- 月運サイクル（27宿の月間リズム） ---
export function calcMonthlyShukuyoCycle(birthIndex, year) {
  const months = [];
  for (let m = 1; m <= 12; m++) {
    const monthDate = new Date(year, m - 1, 15); // 月の中間日
    const baseDate = new Date(1900, 0, 1);
    const diffDays = Math.floor((monthDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    const monthIndex = ((diffDays % 27) + 27) % 27;
    const relation = calcShukuyoRelation(birthIndex, monthIndex);

    months.push({
      month: m,
      shukuyo: SHUKUYO_27[monthIndex],
      relation,
      energy: relation.score
    });
  }
  return months;
}

// --- FLOW層向け宿曜統合データ ---
export function calcShukuyoFlow(birthYear, birthMonth, birthDay) {
  const { shukuyo, index } = calcShukuyo(birthYear, birthMonth, birthDay);
  const dailyShukuyo = calcDailyShukuyo();
  const todayRelation = calcShukuyoRelation(index, dailyShukuyo.index);
  const currentYear = new Date().getFullYear();

  const yearCycles = [];
  for (let y = currentYear; y <= currentYear + 2; y++) {
    yearCycles.push({
      year: y,
      months: calcMonthlyShukuyoCycle(index, y)
    });
  }

  return {
    birthShukuyo: shukuyo,
    birthIndex: index,
    todayShukuyo: dailyShukuyo.shukuyo,
    todayRelation,
    yearCycles
  };
}
