// ========================================
// Seimei Handan (姓名判断) - x-TEN
// ========================================

// --- Simplified stroke count map for common kanji ---
const STROKE_MAP = {
  // Common surnames
  '山': 3, '田': 5, '中': 4, '村': 7, '小': 3, '大': 3, '川': 3, '林': 8,
  '森': 12, '木': 4, '石': 5, '高': 10, '橋': 16, '井': 4, '佐': 7, '藤': 18,
  '伊': 6, '加': 5, '渡': 12, '辺': 5, '松': 8, '竹': 6, '梅': 10, '池': 6,
  '上': 3, '下': 3, '前': 9, '後': 9, '北': 5, '南': 9, '東': 8, '西': 6,
  '野': 11, '原': 10, '岡': 8, '谷': 7, '島': 10, '長': 8, '本': 5, '内': 4,
  '部': 11, '吉': 6, '安': 6, '新': 13, '古': 5, '若': 8, '岩': 8, '清': 11,
  '福': 13, '鈴': 13, '三': 3, '浜': 10, '坂': 7, '宮': 10, '近': 7, '遠': 13,
  '黒': 11, '白': 5, '赤': 7, '青': 8, '金': 8, '銀': 14, '花': 7, '桜': 10,
  '杉': 7, '柳': 9, '星': 9, '月': 4, '日': 4, '光': 6, '水': 4, '火': 4,
  '土': 3, '平': 5, '成': 6, '正': 5, '和': 8, '美': 9, '秀': 7, '千': 3,
  '万': 3, '百': 6, '十': 2, '一': 1, '二': 2, '三': 3, '四': 5, '五': 4,
  '六': 4, '七': 2, '八': 2, '九': 2, '久': 3, '永': 5, '豊': 13, '富': 12,
  '栄': 9, '国': 8, '河': 8, '海': 9, '浦': 10, '港': 12, '市': 5, '町': 7,

  // Common first name characters
  '太': 4, '郎': 9, '朗': 10, '子': 3, '男': 7, '夫': 4, '雄': 12, '彦': 9,
  '介': 4, '助': 7, '輔': 14, '治': 8, '司': 5, '史': 5, '志': 7, '士': 3,
  '之': 3, '也': 3, '人': 2, '斗': 4, '翔': 12, '陽': 12, '蓮': 13, '湊': 12,
  '悠': 11, '真': 10, '誠': 13, '健': 11, '武': 8, '勇': 9, '剛': 10, '亮': 9,
  '信': 9, '義': 13, '仁': 4, '孝': 7, '忠': 8, '礼': 5, '智': 12, '知': 8,
  '直': 8, '隆': 11, '裕': 12, '博': 12, '明': 8, '昭': 9, '和': 8, '幸': 8,
  '恵': 10, '愛': 13, '優': 17, '結': 12, '咲': 9, '菜': 11, '奈': 8, '香': 9,
  '里': 7, '理': 11, '莉': 10, '彩': 11, '紗': 10, '沙': 7, '麻': 11, '衣': 6,
  '葵': 12, '凛': 15, '桃': 10, '実': 8, '果': 8, '音': 9, '風': 9, '空': 8,
  '雪': 11, '春': 9, '夏': 10, '秋': 9, '冬': 5, '朝': 12, '夕': 3, '夜': 8,
  '龍': 16, '虎': 8, '鶴': 21, '亀': 11, '鳳': 14, '麗': 19, '華': 10, '雅': 13,
  '京': 8, '都': 11, '佳': 8, '由': 5, '紀': 9, '希': 7, '望': 11, '夢': 13,
  '天': 4, '地': 6, '心': 4, '魂': 14, '絆': 11, '道': 12, '力': 2, '勝': 12,
  '将': 10, '帥': 9, '英': 8, '雄': 12, '浩': 10, '宏': 7, '広': 5, '弘': 5,
  '泰': 10, '康': 11, '寿': 7, '慶': 15, '喜': 12, '嘉': 14, '祥': 10, '瑞': 13,
  '遥': 12, '陸': 11, '颯': 14, '樹': 16, '蒼': 13, '律': 9, '暖': 13, '晴': 12,
  '紬': 11, '凜': 15, '芽': 8, '依': 8, '乃': 2, '藍': 18, '茜': 9, '杏': 7,
  '瑠': 14, '璃': 15, '玲': 9, '怜': 8, '伶': 7, '玄': 5, '蔵': 15, '門': 8,
  '家': 10, '宗': 8, '基': 11, '元': 4, '丸': 3, '文': 4, '章': 11, '字': 6
};

// Hiragana stroke counts (simplified averages)
const HIRAGANA_STROKES = {
  'あ': 3, 'い': 2, 'う': 2, 'え': 3, 'お': 3,
  'か': 3, 'き': 4, 'く': 1, 'け': 3, 'こ': 2,
  'さ': 3, 'し': 1, 'す': 2, 'せ': 3, 'そ': 1,
  'た': 4, 'ち': 2, 'つ': 1, 'て': 1, 'と': 2,
  'な': 4, 'に': 3, 'ぬ': 4, 'ね': 4, 'の': 1,
  'は': 3, 'ひ': 1, 'ふ': 4, 'へ': 1, 'ほ': 4,
  'ま': 3, 'み': 2, 'む': 3, 'め': 2, 'も': 3,
  'や': 3, 'ゆ': 2, 'よ': 2,
  'ら': 2, 'り': 2, 'る': 1, 'れ': 2, 'ろ': 1,
  'わ': 2, 'を': 3, 'ん': 1,
  'が': 5, 'ぎ': 6, 'ぐ': 3, 'げ': 5, 'ご': 4,
  'ざ': 5, 'じ': 3, 'ず': 4, 'ぜ': 5, 'ぞ': 3,
  'だ': 6, 'ぢ': 4, 'づ': 3, 'で': 3, 'ど': 4,
  'ば': 5, 'び': 3, 'ぶ': 6, 'べ': 3, 'ぼ': 6,
  'ぱ': 4, 'ぴ': 2, 'ぷ': 5, 'ぺ': 2, 'ぽ': 5,
  'っ': 1, 'ゃ': 3, 'ゅ': 2, 'ょ': 2
};

// Katakana stroke counts (simplified averages)
const KATAKANA_STROKES = {
  'ア': 2, 'イ': 2, 'ウ': 3, 'エ': 3, 'オ': 3,
  'カ': 2, 'キ': 3, 'ク': 2, 'ケ': 3, 'コ': 2,
  'サ': 3, 'シ': 3, 'ス': 2, 'セ': 3, 'ソ': 2,
  'タ': 3, 'チ': 3, 'ツ': 3, 'テ': 3, 'ト': 2,
  'ナ': 2, 'ニ': 2, 'ヌ': 3, 'ネ': 4, 'ノ': 1,
  'ハ': 2, 'ヒ': 2, 'フ': 1, 'ヘ': 1, 'ホ': 4,
  'マ': 2, 'ミ': 3, 'ム': 2, 'メ': 2, 'モ': 3,
  'ヤ': 2, 'ユ': 2, 'ヨ': 3,
  'ラ': 2, 'リ': 2, 'ル': 2, 'レ': 1, 'ロ': 3,
  'ワ': 2, 'ヲ': 3, 'ン': 2,
  'ガ': 4, 'ギ': 5, 'グ': 4, 'ゲ': 5, 'ゴ': 4,
  'ザ': 5, 'ジ': 5, 'ズ': 4, 'ゼ': 5, 'ゾ': 4,
  'ダ': 5, 'ヂ': 5, 'ヅ': 5, 'デ': 5, 'ド': 4,
  'バ': 4, 'ビ': 4, 'ブ': 3, 'ベ': 3, 'ボ': 6,
  'パ': 3, 'ピ': 3, 'プ': 2, 'ペ': 2, 'ポ': 5,
  'ッ': 3, 'ャ': 2, 'ュ': 2, 'ョ': 3, 'ー': 1
};

// --- Stroke count function ---
function getStrokeCount(char) {
  if (STROKE_MAP[char] !== undefined) return STROKE_MAP[char];
  if (HIRAGANA_STROKES[char] !== undefined) return HIRAGANA_STROKES[char];
  if (KATAKANA_STROKES[char] !== undefined) return KATAKANA_STROKES[char];

  // Fallback: estimate from character code
  const code = char.charCodeAt(0);
  if (code >= 0x4E00 && code <= 0x9FFF) {
    // CJK Unified Ideographs - rough estimation
    return ((code - 0x4E00) % 20) + 2;
  }
  if (code >= 0x3040 && code <= 0x309F) return 2; // Hiragana fallback
  if (code >= 0x30A0 && code <= 0x30FF) return 2; // Katakana fallback
  return 1;
}

function getTotalStrokes(str) {
  let total = 0;
  for (const char of str) {
    total += getStrokeCount(char);
  }
  return total;
}

// --- Five Kaku Calculation (五格計算) ---
function calcFiveKaku(sei, mei) {
  const seiStrokes = [];
  const meiStrokes = [];
  for (const c of sei) seiStrokes.push(getStrokeCount(c));
  for (const c of mei) meiStrokes.push(getStrokeCount(c));

  const seiTotal = seiStrokes.reduce((a, b) => a + b, 0);
  const meiTotal = meiStrokes.reduce((a, b) => a + b, 0);

  // 天格 (Tenkaku): sum of surname strokes + 1 (for single-char surname, use sei+1)
  const tenkaku = seiTotal + 1;

  // 人格 (Jinkaku): last char of sei + first char of mei
  const jinkaku = seiStrokes[seiStrokes.length - 1] + meiStrokes[0];

  // 地格 (Chikaku): sum of first name strokes + 1 (for single-char first name, use mei+1)
  const chikaku = meiTotal + 1;

  // 総格 (Soukaku): total of all strokes
  const soukaku = seiTotal + meiTotal;

  // 外格 (Gaikaku): soukaku - jinkaku + 1
  const gaikaku = Math.max(soukaku - jinkaku + 1, 2);

  return {
    tenkaku: { name: '天格（家系運）', strokes: tenkaku },
    jinkaku: { name: '人格（主運）', strokes: jinkaku },
    chikaku: { name: '地格（初年運）', strokes: chikaku },
    gaikaku: { name: '外格（対人運）', strokes: gaikaku },
    soukaku: { name: '総格（総合運）', strokes: soukaku }
  };
}

// --- Fortune level from stroke count ---
// Traditional lucky/unlucky numbers in 姓名判断
const DAIKICHI_NUMBERS = [1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37, 38, 39, 41, 45, 47, 48, 52, 57, 58, 61, 63, 65, 67, 68, 81];
const KICHI_NUMBERS = [2, 10, 12, 19, 22, 27, 30, 36, 40, 42, 43, 44, 49, 50, 51, 53, 55, 57, 59, 60, 62, 64, 66, 69, 70, 71, 73, 75, 77, 78];
const CHUKICHI_NUMBERS = [14, 26, 28, 34, 46, 54, 56, 72, 74, 76, 79, 80];
const KYO_NUMBERS = [4, 9, 10, 19, 20, 34, 36, 44, 46, 54, 56, 62, 64, 66, 69, 70, 72, 74, 76, 79, 80];

function getFortuneLevel(strokes) {
  const n = strokes % 81 || strokes;
  if (DAIKICHI_NUMBERS.includes(n)) return { level: '大吉', className: 'daikichi' };
  if (KYO_NUMBERS.includes(n)) return { level: '凶', className: 'kyo' };
  if (CHUKICHI_NUMBERS.includes(n)) return { level: '中吉', className: 'chukichi' };
  if (KICHI_NUMBERS.includes(n)) return { level: '吉', className: 'kichi' };
  return { level: '小吉', className: 'shokichi' };
}

// --- Personality & fortune text generation ---

const PERSONALITY_TEXTS = {
  daikichi: [
    "天性のリーダーシップと強い意志を持ち、周囲を自然と導く存在です。困難な状況でも前向きに立ち向かい、自らの力で道を切り開いていく強さがあります。",
    "生まれながらにして人を惹きつける魅力があり、信頼と人望を集めます。バランス感覚に優れ、知性と行動力を兼ね備えた理想的な資質の持ち主です。",
    "深い洞察力と豊かな感性を持ち、芸術的な才能にも恵まれています。直感が鋭く、大切な場面で正しい判断を下すことができるでしょう。"
  ],
  kichi: [
    "温かい人柄と着実な努力で、周囲から信頼を集めるタイプです。派手さはなくても、一歩一歩確実に前進し、やがて大きな成果を手にするでしょう。",
    "柔軟な思考と適応力に優れ、どんな環境でもうまくやっていける能力があります。人との縁を大切にすることで、運気がさらに上昇します。",
    "堅実さと誠実さが最大の武器です。地道な努力が報われる運勢を持ち、中年期以降に安定した成功を収めるでしょう。"
  ],
  chukichi: [
    "独自の感性と粘り強さを持ち合わせています。時に壁にぶつかることもありますが、その経験が成長の糧となり、やがて花開くでしょう。",
    "感受性が豊かで、人の気持ちを敏感に感じ取る力があります。自分のペースを大切にしながら、着実に目標に向かっていけるタイプです。"
  ],
  shokichi: [
    "繊細な感性と内に秘めた強い意志を持っています。外見からは想像できない芯の強さがあり、いざという時に本領を発揮するでしょう。",
    "慎重さと思慮深さが特徴で、石橋を叩いて渡るタイプ。その堅実さが長い目で見ると大きな財産となります。"
  ],
  kyo: [
    "波乱の多い人生を歩む傾向がありますが、その分だけ人間としての深みが増していきます。困難を乗り越えるたびに強くなり、独自の人生哲学を築いていくでしょう。",
    "変化の多い運勢ですが、それは成長のためのチャンスでもあります。柔軟性と忍耐力を身につけることで、逆境を力に変えることができます。"
  ]
};

const FORTUNE_TEXTS = {
  daikichi: [
    "人生全般にわたって強い運気に恵まれています。特に中年期に大きな転機が訪れ、それまでの努力が実を結ぶ形で飛躍的な成功を収めるでしょう。健康面でも安定しており、長寿の相があります。",
    "運勢の波は穏やかで、大きな挫折なく順調に人生を歩むことができます。40代から50代にかけて最も運気が高まり、社会的な地位と経済的な安定を同時に手にする可能性が高いです。"
  ],
  kichi: [
    "若い頃は苦労もありますが、30代後半から運気が上昇し、安定した生活基盤を築くことができます。特に人間関係に恵まれ、良い縁がさらなる幸運を呼び込むでしょう。",
    "堅実な運勢で、努力が着実に報われるタイプです。急激な変化よりも、じっくりと時間をかけて成功を積み上げていく人生となります。晩年は穏やかで幸福な日々が待っています。"
  ],
  chukichi: [
    "浮き沈みのある運勢ですが、困難を乗り越えるたびに一回り大きく成長していきます。特に人との出会いが運勢を左右するので、ご縁を大切にしてください。",
    "平均的な運勢ながら、特定の分野で突出した才能を発揮する可能性があります。自分の得意分野を見極め、そこに集中することで大きな成果を上げるでしょう。"
  ],
  shokichi: [
    "控えめながらも着実に運気が上昇していく運勢です。派手な成功よりも、心の豊かさと人間関係の深さに恵まれる人生となるでしょう。",
    "地道な努力が必要な運勢ですが、粘り強く取り組むことで確実に成果を出せます。焦らず自分のペースを守ることが成功の鍵です。"
  ],
  kyo: [
    "変動の多い運勢ですが、試練の中で鍛えられた精神力があなたの最大の強みになります。困難を経験した人だけが持つ深い共感力と知恵が、やがて周囲の人々を支える力となるでしょう。",
    "運気の波が激しい分、人生経験が豊かになり、独自の魅力を身につけることができます。特に精神的な成長を大切にすることで、運勢が好転する兆しがあります。"
  ]
};

const RELATIONSHIP_TEXTS = {
  daikichi: "対人運に大変恵まれています。あなたの誠実さと包容力が人を引き寄せ、生涯にわたって良質な人間関係を築くことができるでしょう。特に目上の人からの引き立てがあり、社会的な成功を後押しします。異性からの好感度も高く、良縁に恵まれやすい傾向があります。",
  kichi: "穏やかな人柄が好印象を与え、自然と人が集まってきます。特に同年代の仲間との絆が深く、困った時に助けてくれる友人に恵まれるでしょう。恋愛面では、友情から愛情に発展するパターンが多いかもしれません。",
  chukichi: "人見知りなところがありますが、一度打ち解けると深い信頼関係を築けるタイプです。少数精鋭の人間関係を大切にすることで、質の高い交友関係が広がっていきます。",
  shokichi: "内向的な面がありますが、その分だけ深い人間関係を築く力があります。表面的な付き合いよりも、心の通った関係を求める傾向があり、それが長い目で見ると大きな財産になります。",
  kyo: "対人関係に波がありますが、苦労した分だけ人を見る目が養われていきます。真に信頼できる人を見極める力が備わっており、少数でも本当に大切な人間関係を築けるでしょう。"
};

const CAREER_TEXTS = {
  daikichi: "仕事運に大変恵まれており、どんな分野でも成功を収める可能性があります。特にリーダーシップを発揮できるポジションで力を発揮し、組織やチームを成功に導く才能があります。起業にも向いており、独立して成功する相も出ています。創造的な分野と管理的な分野の両方で才能を発揮できる稀有な資質です。",
  kichi: "堅実な仕事ぶりが評価され、着実にキャリアアップしていくタイプです。特に専門性を磨くことで高い評価を得られるでしょう。チームワークを大切にする姿勢が周囲から信頼を集め、重要なプロジェクトを任されることが増えていきます。",
  chukichi: "特定の分野で専門性を高めることで、大きな成果を上げるタイプです。ゼネラリストよりもスペシャリストとしての道が向いています。自分の興味と才能が一致する分野を見つけることが、キャリア成功の鍵となるでしょう。",
  shokichi: "地道な努力が実を結ぶキャリア運です。派手な成功よりも、確実にスキルを積み上げていくことで、やがて不可欠な存在として認められるでしょう。焦らず自分の道を歩むことが大切です。",
  kyo: "キャリアにおいて紆余曲折がありますが、その経験が唯一無二の強みになります。転職や方向転換を恐れず、自分に合った道を模索することで、最終的に天職と呼べる仕事に出会えるでしょう。"
};

function generateReading(sei, mei, fiveKaku) {
  // Determine overall fortune level based on soukaku (most important)
  const soukakuFortune = getFortuneLevel(fiveKaku.soukaku.strokes);
  const jinkakuFortune = getFortuneLevel(fiveKaku.jinkaku.strokes);
  const gaikakuFortune = getFortuneLevel(fiveKaku.gaikaku.strokes);

  // Use hash-like seed from name for consistent but varied text selection
  const seed = (fiveKaku.soukaku.strokes * 7 + fiveKaku.jinkaku.strokes * 13 + fiveKaku.chikaku.strokes * 3) % 100;

  function pickText(textMap, fortuneLevel) {
    const texts = textMap[fortuneLevel];
    if (!texts) return textMap['chukichi'] ? textMap['chukichi'][0] : '';
    if (typeof texts === 'string') return texts;
    return texts[seed % texts.length];
  }

  // Map fortune class names to text keys
  function levelKey(fortune) {
    return fortune.className;
  }

  const personality = pickText(PERSONALITY_TEXTS, levelKey(jinkakuFortune));
  const fortune = pickText(FORTUNE_TEXTS, levelKey(soukakuFortune));
  const relationship = RELATIONSHIP_TEXTS[levelKey(gaikakuFortune)] || RELATIONSHIP_TEXTS['chukichi'];
  const career = CAREER_TEXTS[levelKey(jinkakuFortune)] || CAREER_TEXTS['chukichi'];

  // Advice based on overall balance
  const fortuneLevels = [
    getFortuneLevel(fiveKaku.tenkaku.strokes),
    jinkakuFortune,
    getFortuneLevel(fiveKaku.chikaku.strokes),
    gaikakuFortune,
    soukakuFortune
  ];
  const kyoCount = fortuneLevels.filter(f => f.className === 'kyo').length;
  const daikichiCount = fortuneLevels.filter(f => f.className === 'daikichi').length;

  let advice;
  if (daikichiCount >= 3) {
    advice = `「${sei}${mei}」というお名前は、五格のバランスが非常に良く、生涯を通じて安定した運気に恵まれます。その恵まれた運勢を活かすためにも、感謝の気持ちを忘れず、周囲への配慮を大切にしてください。あなたの姓名が持つ力は、謙虚さによってさらに輝きを増します。積極的に新しいことに挑戦し、その才能を社会に還元していくことで、さらなる幸運が巡ってくるでしょう。`;
  } else if (kyoCount >= 3) {
    advice = `「${sei}${mei}」というお名前には試練の暗示がありますが、それは成長のための贈り物でもあります。困難に直面した時こそ、あなたの真の強さが発揮されます。周囲の助けを素直に受け入れ、一人で抱え込まないことが大切です。また、通称やペンネームを活用することで、運気の流れを変えることもできます。何より大切なのは、名前に縛られず自分の力を信じることです。`;
  } else {
    advice = `「${sei}${mei}」というお名前は、バランスの取れた運勢を示しています。人格の画数が示す主運を中心に、あなたらしい人生を切り開いていけるでしょう。日々の小さな努力の積み重ねが、やがて大きな実りとなって返ってきます。自分の長所を伸ばすことに注力し、苦手な部分は周囲の力を借りることで、より充実した人生を歩むことができるでしょう。名前の力を信じて、自信を持って前に進んでください。`;
  }

  return { personality, fortune, relationship, career, advice };
}

// --- UI Functions ---

let currentResult = null;

function showPhase(phaseId) {
  document.querySelectorAll('[id^="phase-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById(phaseId).classList.remove('hidden');
}

function startSeimei() {
  const sei = document.getElementById('input-sei').value.trim();
  const mei = document.getElementById('input-mei').value.trim();

  if (!sei || !mei) {
    alert('姓と名を入力してください');
    return;
  }

  showPhase('phase-loading');

  setTimeout(() => {
    const fiveKaku = calcFiveKaku(sei, mei);
    const reading = generateReading(sei, mei, fiveKaku);
    currentResult = { sei, mei, fiveKaku, reading };
    displayResult(currentResult);
    showPhase('phase-result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 2000);
}

function displayResult(result) {
  const { sei, mei, fiveKaku, reading } = result;

  document.getElementById('result-name-display').textContent = `${sei} ${mei}`;
  document.getElementById('result-subtitle').textContent = `総格 ${fiveKaku.soukaku.strokes} 画`;

  // Build five kaku grid
  const gridEl = document.getElementById('seimei-grid');
  const kakuKeys = ['tenkaku', 'jinkaku', 'chikaku', 'gaikaku', 'soukaku'];
  gridEl.innerHTML = kakuKeys.map(key => {
    const kaku = fiveKaku[key];
    const fortune = getFortuneLevel(kaku.strokes);
    return `
      <div class="seimei-kaku">
        <span class="seimei-kaku__name">${kaku.name}</span>
        <span class="seimei-kaku__strokes">${kaku.strokes}画</span>
        <span class="seimei-kaku__fortune seimei-kaku__fortune--${fortune.className}">${fortune.level}</span>
      </div>
    `;
  }).join('');

  document.getElementById('result-personality').textContent = reading.personality;
  document.getElementById('result-fortune').textContent = reading.fortune;
  document.getElementById('result-relationship').textContent = reading.relationship;
  document.getElementById('result-career').textContent = reading.career;
  document.getElementById('result-advice').textContent = reading.advice;
}

function resetSeimei() {
  currentResult = null;
  document.getElementById('input-sei').value = '';
  document.getElementById('input-mei').value = '';
  showPhase('phase-input');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Share
function shareTwitter() {
  if (!currentResult) return;
  const { sei, mei, fiveKaku } = currentResult;
  const fortune = getFortuneLevel(fiveKaku.soukaku.strokes);
  const text = encodeURIComponent(`x-TEN姓名判断の結果：「${sei}${mei}」さんの総格は${fiveKaku.soukaku.strokes}画で${fortune.level}！\n`);
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareLine() {
  if (!currentResult) return;
  const { sei, mei, fiveKaku } = currentResult;
  const fortune = getFortuneLevel(fiveKaku.soukaku.strokes);
  const text = encodeURIComponent(`x-TEN姓名判断の結果：「${sei}${mei}」さんの総格は${fiveKaku.soukaku.strokes}画で${fortune.level}！`);
  window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
}
