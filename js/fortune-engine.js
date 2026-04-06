// ========================================
// Fortune Engine - Orchestrator
// ES Module - fortune-engine.js
// Coordinates pillars + vedic calculations,
// calls AI API or falls back to local generation
// ========================================

import { FIVE_ELEMENTS } from './pillars.js';
import { fetchFortuneFromAPI } from './api-client.js';

// --- Main Entry Point ---
export async function runFortuneEngine(birthData, pillarsData, vedicData) {
  // Try API first, fall back to local generation
  try {
    const apiResult = await fetchFortuneFromAPI(birthData, pillarsData, vedicData);
    if (apiResult) return apiResult;
  } catch (e) {
    console.warn('AI API unavailable, using local generation:', e.message);
  }

  // Fallback: generate locally
  return generateLocalFortune(birthData, pillarsData, vedicData);
}

// --- Local Fortune Generation (Fallback) ---
function generateLocalFortune(birthData, pillarsData, vedicData) {
  const { dayStem, elementInfo, dominantElement, yearPillar, monthPillar, dayPillar, hourPillar, tenGods, kuubou } = pillarsData;
  const { nakshatra, rashi, dasha } = vedicData;

  const title = `${dayPillar.label}の${nakshatra.name}`;
  const subtitle = `${dominantElement}の気質 × ${nakshatra.deity}の守護`;

  // Strengths based on element + nakshatra
  const strengths = generateStrengths(dayStem, nakshatra, elementInfo);
  const weaknesses = generateWeaknesses(dayStem, nakshatra, elementInfo);

  return {
    title,
    subtitle,
    overall: generateOverall(pillarsData, vedicData),
    strengths,
    weaknesses,
    career: generateCareer(dayStem, nakshatra, elementInfo),
    love: generateLove(dayStem, yearPillar, nakshatra, rashi),
    money: generateMoney(dayStem, elementInfo, nakshatra, dasha),
    health: generateHealth(elementInfo, nakshatra),
    elementBalance: pillarsData.elementBalance,
    dailyAdvice: generateDailyAdvice(dominantElement, nakshatra),
    isLocalFallback: true
  };
}

// --- Overall Analysis ---
function generateOverall(pillarsData, vedicData) {
  const { dayStem, yearPillar, monthPillar, dayPillar, dominantElement, elementInfo, tenGods, kuubou, hasHourPillar } = pillarsData;
  const { nakshatra, rashi, dasha } = vedicData;

  const yearTenGod = tenGods.year || '';
  const monthTenGod = tenGods.month || '';

  let text = `あなたの日干は「${dayStem.name}」— ${dayStem.trait}。`;
  text += `年柱${yearPillar.label}・月柱${monthPillar.label}・日柱${dayPillar.label}の命式から、${dominantElement}のエネルギーが基盤となっています。`;

  if (!hasHourPillar) {
    text += `（出生時刻が不明のため、時柱を除いた3柱での解析です。）`;
  }

  text += `\n\nインド占星術では${nakshatra.name}（${nakshatra.deity}の守護）の影響を受け、${nakshatra.quality}な性質が際立ちます。`;
  text += `ヴェーダ星座は${rashi.jaName}（${rashi.name}）、${rashi.ruler}が支配する${rashi.element}のエネルギーが加わります。`;
  text += `\n\n現在は${dasha.ruler}のダシャー期（${dasha.period}）にあり、`;

  const dashaAdvice = {
    "ケートゥ": "霊的な探究と自己変革の時期です。執着を手放すことで新たな道が開かれます。",
    "金星": "美と豊かさ、人間関係が開花する時期です。クリエイティブな活動が吉。",
    "太陽": "リーダーシップと自己表現が高まる時期。自信を持って前に進みましょう。",
    "月": "感受性と直感が鋭くなる時期。内面の声に耳を傾けてください。",
    "火星": "エネルギーと行動力に満ちた時期。積極的なチャレンジが実を結びます。",
    "ラーフ": "野心と変革の時期。新しい領域への挑戦が飛躍のきっかけになります。",
    "木星": "知恵と拡大の時期。学びと成長が加速する黄金期です。",
    "土星": "忍耐と基盤固めの時期。堅実な努力が長期的な成功を築きます。",
    "水星": "知性とコミュニケーションが冴える時期。情報収集と発信が鍵となります。"
  };

  text += dashaAdvice[dasha.ruler] || "運気の転換点にあります。";
  text += `\n\n四柱推命とインド占星術の二つの体系が示す共通項として、あなたは${dayStem.yin_yang === "陽" ? "積極的に道を切り開く" : "内面の力で周囲を導く"}タイプです。`;
  text += `空亡の${kuubou[0].name}・${kuubou[1].name}には注意しつつ、${elementInfo.season}の時期に特に運気が高まります。`;

  return text;
}

// --- Strengths ---
function generateStrengths(dayStem, nakshatra, elementInfo) {
  const stemStrengths = {
    "木": ["成長力と柔軟性", "正義感とリーダーシップ"],
    "火": ["情熱と行動力", "プレゼンテーション能力"],
    "土": ["安定感と信頼性", "マネジメント適性"],
    "金": ["決断力と精密さ", "分析力と審美眼"],
    "水": ["知恵と適応力", "クリエイティビティ"]
  };

  const base = stemStrengths[dayStem.element] || ["バランス感覚"];
  base.push(`${nakshatra.quality}（${nakshatra.name}由来）`);
  return base;
}

// --- Weaknesses ---
function generateWeaknesses(dayStem, nakshatra, elementInfo) {
  const stemWeaknesses = {
    "木": ["怒りっぽさ", "頑固さが出やすい"],
    "火": ["衝動的な判断", "燃え尽き症候群のリスク"],
    "土": ["変化への抵抗感", "心配性になりやすい"],
    "金": ["完璧主義", "感情表現の苦手さ"],
    "水": ["優柔不断", "不安感への過敏さ"]
  };
  return stemWeaknesses[dayStem.element] || ["過度な自己批判"];
}

// --- Career ---
function generateCareer(dayStem, nakshatra, elementInfo) {
  const careerMap = {
    "木": "企画力や成長戦略に優れ、新規事業やスタートアップとの相性が抜群。組織の中でも「種を蒔く人」として重宝されます。",
    "火": "プレゼンテーションや営業など、人前で輝く仕事で力を発揮。アイデアを形にするスピード感が最大の武器。",
    "土": "マネジメントやプロジェクト管理など、安定した基盤を築く仕事が適職。チームの精神的支柱になれる存在。",
    "金": "精密な作業や分析が求められる仕事、金融やIT分野で才能を発揮。データに基づく判断力が秀逸。",
    "水": "クリエイティブな分野や研究職、コンサルティングなど知識を活かす仕事が天職。情報の海から宝を見つける嗅覚あり。"
  };

  let text = careerMap[dayStem.element];
  text += `\n\n${nakshatra.name}の「${nakshatra.quality}」な特性は、職場での差別化要因になります。`;
  text += dayStem.yin_yang === "陽"
    ? "リーダーシップを発揮する場面が増える時期。周囲を巻き込みながら大きなプロジェクトに挑戦してみてください。"
    : "縁の下の力持ちとして重要な役割を果たすでしょう。あなたの丁寧な仕事ぶりが認められる時が近づいています。";

  return text;
}

// --- Love ---
function generateLove(dayStem, yearPillar, nakshatra, rashi) {
  const loveMap = {
    "木": "誠実で一途な愛情を持つタイプ。自然体でいられる相手との縁が最も深くなります。",
    "火": "情熱的で魅力的、周囲を自然と惹きつけます。ただし相手のペースも尊重することが長続きの秘訣。",
    "土": "安定した愛情を築ける堅実なタイプ。信頼を大切にするあなたには、穏やかなパートナーが理想的。",
    "金": "理想が高い分、出会いを逃しやすい面も。完璧を求めすぎず、心のつながりを重視してみてください。",
    "水": "深い愛情と包容力の持ち主。直感でピンとくる相手を大切にすると良縁に恵まれます。"
  };

  let text = loveMap[dayStem.element];
  text += `\n\n${nakshatra.name}の守護を受けるあなたは、「${nakshatra.trait.slice(0, 20)}」という特性が対人面でも活きます。`;
  text += `ヴェーダ占星術の${rashi.jaName}は${rashi.element}の星座で、${rashi.quality}宮の影響から`;
  text += rashi.quality === "活動" ? "自ら積極的に動くことで良い出会いが生まれます。" :
    rashi.quality === "不動" ? "じっくりと関係を育む姿勢が信頼を深めます。" :
    "多様な人間関係の中から運命の相手が現れるでしょう。";

  return text;
}

// --- Money ---
function generateMoney(dayStem, elementInfo, nakshatra, dasha) {
  const moneyMap = {
    "木": "成長型の投資や自己投資との相性が良好。学びにお金を使うことで大きなリターンが期待できます。",
    "火": "直感が冴える分、衝動買いにも注意。エネルギーを計画的な支出に向ければ財運は上昇傾向。",
    "土": "コツコツ貯蓄する力に恵まれた堅実タイプ。不動産や長期投資など、着実な資産形成が吉。",
    "金": "お金に対する鋭い感覚の持ち主。副業や新しい収入源を模索すると良い結果が出るでしょう。",
    "水": "お金の流れを読む直感が強み。情報収集を怠らず、タイミングを見極めた行動を。"
  };

  let text = moneyMap[dayStem.element];
  text += `\n\n${dasha.ruler}期のダシャーが財運に与える影響として、`;

  const dashaMoneyMap = {
    "金星": "物質的な豊かさを享受しやすい時期。良い投資機会が訪れるかもしれません。",
    "木星": "拡大と成長の惑星期。収入が増加する可能性が高い黄金期です。",
    "土星": "節約と堅実な資産運用がテーマ。この時期の忍耐が将来の大きな財につながります。",
    "水星": "ビジネスセンスが冴える時期。情報をお金に変える力が高まっています。"
  };

  text += dashaMoneyMap[dasha.ruler] || "着実な蓄財を心がけることで安定した基盤を築けるでしょう。";
  text += `ラッキーカラーの${elementInfo.color}を財布やアクセサリーに取り入れると、金運がさらにアップします。`;

  return text;
}

// --- Health ---
function generateHealth(elementInfo, nakshatra) {
  const healthMap = {
    "木": "肝臓や目のケアを意識しましょう。ストレッチやヨガなど、柔軟性を高める運動がおすすめです。",
    "火": "心臓や血行に注意。適度な有酸素運動と十分な休息のバランスを取りましょう。",
    "土": "胃腸のコンディションに気を配って。規則正しい食事と消化に良い食材を選ぶことが大切。",
    "金": "呼吸器系のケアが重要。深呼吸の習慣や、空気の良い場所での散歩が健康運をアップします。",
    "水": "腎臓や水分バランスに注意。十分な水分補給と、冷えへの対策を心がけましょう。"
  };

  const element = Object.entries(FIVE_ELEMENTS).find(([k, v]) => v === elementInfo)?.[0] || "木";
  let text = healthMap[element];
  text += `\n\n${nakshatra.name}の影響で、${elementInfo.season}の季節の変わり目には特に体調管理を意識してください。`;
  text += `${elementInfo.direction}の方角に向かって朝の深呼吸をすると、気の流れが整います。`;

  return text;
}

// --- Daily Advice ---
function generateDailyAdvice(element, nakshatra) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayAdvice = {
    0: "日曜の太陽エネルギーを味方に。午前中に重要な決断を。",
    1: "月曜は月の影響で感受性UP。クリエイティブな作業に最適。",
    2: "火曜は火星の活力日。体を動かしてエネルギーを循環させて。",
    3: "水曜は水星の知性日。情報収集と学習に最適な1日。",
    4: "木曜は木星の拡大日。新しい挑戦やネットワーキングが吉。",
    5: "金曜は金星の調和日。美的感覚を活かした仕事が捗る。",
    6: "土曜は土星の集中日。長期計画の見直しと基盤固めを。"
  };

  return `${dayAdvice[dayOfWeek]}（${element}の気質 × ${nakshatra.name}の力を活かして）`;
}
