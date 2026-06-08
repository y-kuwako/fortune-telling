// ======================================================
// 本日の診断結果 - 宿曜占星術（ベース）× 四柱推命（補正）
// xten.profile を読み、本日のあなた専用の運勢を生成
// ======================================================

(function () {
  'use strict';

  const PROFILE_KEY = 'xten.profile';

  // --- 十干 ---
  const HEAVENLY_STEMS = [
    { name: '甲', element: '木', yin_yang: '陽' },
    { name: '乙', element: '木', yin_yang: '陰' },
    { name: '丙', element: '火', yin_yang: '陽' },
    { name: '丁', element: '火', yin_yang: '陰' },
    { name: '戊', element: '土', yin_yang: '陽' },
    { name: '己', element: '土', yin_yang: '陰' },
    { name: '庚', element: '金', yin_yang: '陽' },
    { name: '辛', element: '金', yin_yang: '陰' },
    { name: '壬', element: '水', yin_yang: '陽' },
    { name: '癸', element: '水', yin_yang: '陰' }
  ];

  // --- 十二支 ---
  const EARTHLY_BRANCHES = [
    { name: '子', animal: '鼠' }, { name: '丑', animal: '牛' }, { name: '寅', animal: '虎' },
    { name: '卯', animal: '兎' }, { name: '辰', animal: '龍' }, { name: '巳', animal: '蛇' },
    { name: '午', animal: '馬' }, { name: '未', animal: '羊' }, { name: '申', animal: '猿' },
    { name: '酉', animal: '鶏' }, { name: '戌', animal: '犬' }, { name: '亥', animal: '猪' }
  ];

  // --- 27宿 ---
  const SHUKUYO_27 = [
    { name: '昴宿', element: '金', luck: '芸術・ファッション' },
    { name: '畢宿', element: '土', luck: 'コツコツ型の成功' },
    { name: '觜宿', element: '日', luck: '交渉・企画' },
    { name: '参宿', element: '月', luck: '一発逆転' },
    { name: '井宿', element: '火', luck: '計画的な成功' },
    { name: '鬼宿', element: '水', luck: '最強の運気宿' },
    { name: '柳宿', element: '木', luck: '熱意が運を開く' },
    { name: '星宿', element: '金', luck: '人気運' },
    { name: '張宿', element: '土', luck: 'リーダー運' },
    { name: '翼宿', element: '日', luck: '晩年に花開く' },
    { name: '軫宿', element: '月', luck: '人徳' },
    { name: '角宿', element: '火', luck: '人間関係' },
    { name: '亢宿', element: '水', luck: '高い理想の実現' },
    { name: '氐宿', element: '木', luck: '忍耐が実を結ぶ' },
    { name: '房宿', element: '金', luck: '出世運' },
    { name: '心宿', element: '土', luck: '多方面での活躍' },
    { name: '尾宿', element: '日', luck: '人望' },
    { name: '箕宿', element: '月', luck: '自由な生き方' },
    { name: '斗宿', element: '火', luck: '大きな目標達成' },
    { name: '女宿', element: '水', luck: '実力勝負' },
    { name: '虚宿', element: '木', luck: '精神的成長' },
    { name: '危宿', element: '金', luck: '危機を好機に変える' },
    { name: '室宿', element: '土', luck: '事業運' },
    { name: '壁宿', element: '日', luck: '安定運' },
    { name: '奎宿', element: '月', luck: '学術・文化' },
    { name: '婁宿', element: '火', luck: '商売繁盛' },
    { name: '胃宿', element: '水', luck: 'パイオニア運' }
  ];

  const SEVEN_LUMINARIES = ['日', '月', '火', '水', '木', '金', '土'];

  // --- プロフィール基本データ用 ---
  const ANIMAL_NAMES = ['鼠','牛','虎','兎','龍','蛇','馬','羊','猿','鶏','犬','猪'];
  const LAGNAS_12 = ['牡羊','牡牛','双子','蟹','獅子','乙女','天秤','蠍','射手','山羊','水瓶','魚'];
  const SIX_GROUPS = ['安住','破壊','栄達','親和','友好','危機'];
  const PERSONALITY_DIMENSIONS = [
    { label: '関心', leftLabel: '外向性', rightLabel: '内向性' },
    { label: '姿勢', leftLabel: '積極性', rightLabel: '消極性' },
    { label: '目的', leftLabel: '接近性', rightLabel: '回避性' },
    { label: '行動', leftLabel: '能動性', rightLabel: '受動性' },
    { label: '思考', leftLabel: '楽観性', rightLabel: '悲観性' },
    { label: '器',   leftLabel: '受容性', rightLabel: '拒絶/抵抗性' }
  ];
  const EMOTIONS_18 = [
    '興味/発見','興奮/恍惚','満足/歓喜','悩み/葛藤','疑問/混乱',
    '疑心/警戒','妄想/空想','不安/恐怖','羞恥','怒り/憤慨',
    '悲しみ/落胆','退屈','尊敬','軽蔑','畏怖',
    '親愛/感謝','冷静','驚き'
  ];

  function calcZodiacSign(month, day) {
    const cutoffs = [
      { month: 1, day: 19, name: '山羊座' }, { month: 2, day: 18, name: '水瓶座' },
      { month: 3, day: 20, name: '魚座' },   { month: 4, day: 19, name: '牡羊座' },
      { month: 5, day: 20, name: '牡牛座' }, { month: 6, day: 21, name: '双子座' },
      { month: 7, day: 22, name: '蟹座' },   { month: 8, day: 22, name: '獅子座' },
      { month: 9, day: 22, name: '乙女座' }, { month: 10, day: 23, name: '天秤座' },
      { month: 11, day: 22, name: '蠍座' },  { month: 12, day: 21, name: '射手座' }
    ];
    for (const c of cutoffs) {
      if (month < c.month || (month === c.month && day <= c.day)) return c.name;
    }
    return '山羊座';
  }

  function formatBloodType(blood) {
    if (!blood) return '未入力';
    const s = String(blood).trim().toUpperCase();
    if (/^(A|B|AB|O)$/.test(s)) return s + '型';
    return s;
  }

  function calcLagnaShort(profile, month, day) {
    let hour = profile && profile.birthHour != null ? parseInt(profile.birthHour) : null;
    if (isNaN(hour)) hour = null;
    if (hour === null) hour = (month * 31 + day) % 24;
    return LAGNAS_12[(Math.floor(hour / 2) + month) % 12];
  }

  function calcNakshatraQuality(month, day) {
    const QUALITIES = [
      '活動的・冒険好き','忍耐強い・献身的','鋭敏・リーダー気質','魅力的・芸術的',
      '探究的・知的好奇心','情熱的・変革者','楽観的・寛大','慈悲深い・教育的',
      '洞察力・神秘的','高貴・伝統重視','創造的・社交的','誠実・協力的',
      '器用・実践的','魅力的・独創的','独立心・柔軟','決意・集中力',
      '親しみやすい・献身的','保護的・責任感','探究的・根本的','自信・活力',
      'リーダー・普遍的','学習力・広い視野','野心的・音楽的','癒し・神秘的',
      '情熱的・理想主義','賢明・安定','慈悲深い・直感的'
    ];
    const dayOfYear = (month - 1) * 30 + day;
    return { quality: QUALITIES[dayOfYear % 27] };
  }

  function calcSixGroupsFromIdx(idx) { return SIX_GROUPS[idx % 6]; }

  function seedHash(input) {
    let h = 0;
    const s = String(input);
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
    return Math.abs(h);
  }

  function calcTendency(input) {
    const { profile, dayStem, monthBranch, lagnaShort, nakshatraQuality, sixGroups, shukuyoEl } = input;
    const mbti = profile.mbti && /^[EI][NS][TF][JP]$/.test(String(profile.mbti).toUpperCase())
      ? String(profile.mbti).toUpperCase() : null;
    const dayEl = dayStem.element;
    const dayYY = dayStem.yin_yang;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    const LAGNA_EI={'牡羊':14,'牡牛':-6,'双子':18,'蟹':-10,'獅子':16,'乙女':-8,'天秤':12,'蠍':-14,'射手':15,'山羊':-6,'水瓶':10,'魚':-10};
    const LAGNA_JP={'牡羊':10,'牡牛':4,'双子':-4,'蟹':-2,'獅子':8,'乙女':10,'天秤':0,'蠍':6,'射手':-2,'山羊':12,'水瓶':-6,'魚':-8};
    const LAGNA_NS={'牡羊':8,'牡牛':-6,'双子':10,'蟹':-2,'獅子':6,'乙女':-8,'天秤':2,'蠍':4,'射手':12,'山羊':-4,'水瓶':14,'魚':10};
    const LAGNA_ACT={'牡羊':14,'牡牛':-4,'双子':8,'蟹':-8,'獅子':12,'乙女':-2,'天秤':2,'蠍':6,'射手':10,'山羊':6,'水瓶':4,'魚':-10};
    const LAGNA_OPT={'牡羊':10,'牡牛':6,'双子':8,'蟹':-6,'獅子':12,'乙女':-4,'天秤':8,'蠍':-10,'射手':14,'山羊':-2,'水瓶':10,'魚':4};
    const LAGNA_RECP={'牡羊':-8,'牡牛':10,'双子':-2,'蟹':14,'獅子':-6,'乙女':4,'天秤':10,'蠍':-12,'射手':2,'山羊':-4,'水瓶':-6,'魚':14};
    const SIX_EI={'安住':-6,'破壊':4,'栄達':10,'親和':8,'友好':16,'危機':-4};
    const SIX_JP={'安住':-6,'破壊':8,'栄達':12,'親和':4,'友好':2,'危機':6};
    const SIX_APP={'安住':-4,'破壊':6,'栄達':14,'親和':6,'友好':8,'危機':-10};
    const SIX_ACT={'安住':-12,'破壊':14,'栄達':12,'親和':2,'友好':6,'危機':4};
    const SIX_OPT={'安住':8,'破壊':-4,'栄達':14,'親和':10,'友好':8,'危機':-12};
    const SIX_RECP={'安住':10,'破壊':-10,'栄達':-2,'親和':14,'友好':12,'危機':-12};
    const EL_JP={'木':4,'火':10,'土':-4,'金':8,'水':-8};
    const EL_APP={'木':10,'火':12,'土':-2,'金':-6,'水':-8};
    const EL_ACT={'木':8,'火':14,'土':-4,'金':4,'水':-10};
    const EL_OPT={'木':12,'火':10,'土':2,'金':-8,'水':-10};
    const EL_RECP={'木':4,'火':-4,'土':12,'金':-12,'水':8};
    const SHUKUYO_EL_OPT={'金':-4,'土':4,'日':10,'月':-4,'火':4,'水':-6,'木':12};

    let kanshin=50;  if (mbti) kanshin+=mbti[0]==='E'?20:-20;  kanshin+=dayYY==='陽'?10:-10;  kanshin+=LAGNA_EI[lagnaShort]||0;  kanshin+=SIX_EI[sixGroups]||0;
    let shisei=50;   if (mbti) shisei+=mbti[3]==='J'?14:-10;   shisei+=EL_JP[dayEl]||0;       shisei+=SIX_JP[sixGroups]||0;     shisei+=LAGNA_JP[lagnaShort]||0;
    let mokuteki=50; if (mbti) mokuteki+=mbti[1]==='N'?12:-6;  mokuteki+=dayYY==='陽'?6:-6;   mokuteki+=EL_APP[dayEl]||0;       mokuteki+=SIX_APP[sixGroups]||0; mokuteki+=LAGNA_NS[lagnaShort]||0;
    let koudou=50;   if (mbti) { koudou+=mbti[2]==='T'?8:-8; koudou+=mbti[3]==='J'?6:-6; } koudou+=dayYY==='陽'?8:-8; koudou+=EL_ACT[dayEl]||0; koudou+=LAGNA_ACT[lagnaShort]||0; koudou+=SIX_ACT[sixGroups]||0;
    let shikou=50;   if (mbti) shikou+=mbti[1]==='N'?10:-4;   shikou+=EL_OPT[dayEl]||0;     shikou+=LAGNA_OPT[lagnaShort]||0; shikou+=SIX_OPT[sixGroups]||0; shikou+=SHUKUYO_EL_OPT[shukuyoEl]||0;
    let utsuwa=50;   if (mbti) utsuwa+=mbti[2]==='F'?18:-18;  utsuwa+=EL_RECP[dayEl]||0;    utsuwa+=LAGNA_RECP[lagnaShort]||0; utsuwa+=SIX_RECP[sixGroups]||0;

    const values = [kanshin, shisei, mokuteki, koudou, shikou, utsuwa];
    const personality = PERSONALITY_DIMENSIONS.map((d, i) => {
      const v = clamp(Math.round(values[i]), 12, 88);
      return { ...d, leftValue: v, rightValue: 100 - v };
    });

    const seed = `${dayStem.name}-${monthBranch.name}-${lagnaShort}-${nakshatraQuality}-${sixGroups}-${mbti||'?'}-${profile.blood||'?'}`;
    const rawList = EMOTIONS_18.map((label, i) => ({ label, weight: 8 + (seedHash(seed + 'em' + i) % 16) }));
    const addBonus = (l, b) => { const f = rawList.find(w => w.label === l); if (f) f.weight += b; };

    if (mbti) {
      if (mbti[0]==='E'){ addBonus('興味/発見',6); addBonus('興奮/恍惚',5); addBonus('驚き',3); } else { addBonus('冷静',6); addBonus('妄想/空想',5); addBonus('羞恥',4); }
      if (mbti[1]==='N'){ addBonus('興味/発見',6); addBonus('妄想/空想',5); addBonus('畏怖',3); } else { addBonus('満足/歓喜',5); addBonus('尊敬',4); }
      if (mbti[2]==='T'){ addBonus('冷静',6); addBonus('軽蔑',4); addBonus('疑問/混乱',3); } else { addBonus('親愛/感謝',7); addBonus('悲しみ/落胆',5); addBonus('不安/恐怖',4); }
      if (mbti[3]==='J'){ addBonus('疑心/警戒',5); addBonus('尊敬',3); } else { addBonus('驚き',5); addBonus('退屈',3); addBonus('興味/発見',3); }
    }
    ({'木':[['興味/発見',5],['満足/歓喜',4],['退屈',2]],'火':[['興奮/恍惚',7],['怒り/憤慨',5],['驚き',3]],'土':[['満足/歓喜',6],['尊敬',4],['退屈',3]],'金':[['冷静',6],['軽蔑',4],['疑問/混乱',3]],'水':[['悲しみ/落胆',5],['妄想/空想',5],['悩み/葛藤',3]]}[dayEl]||[]).forEach(([e,b])=>addBonus(e,b));
    const branchIdx = EARTHLY_BRANCHES.findIndex(b => b.name === monthBranch.name);
    const BRANCH_EMO=[['冷静',4],['尊敬',4],['怒り/憤慨',4],['妄想/空想',4],['興奮/恍惚',4],['疑心/警戒',4],['驚き',4],['悲しみ/落胆',4],['興味/発見',4],['疑問/混乱',4],['親愛/感謝',4],['畏怖',4]];
    if (branchIdx >= 0) { const [e, b] = BRANCH_EMO[branchIdx]; addBonus(e, b); }
    ({'牡羊':[['怒り/憤慨',5],['興奮/恍惚',4]],'牡牛':[['満足/歓喜',6],['退屈',3]],'双子':[['興味/発見',6],['驚き',4]],'蟹':[['悲しみ/落胆',5],['親愛/感謝',5]],'獅子':[['興奮/恍惚',6],['尊敬',4]],'乙女':[['冷静',5],['疑問/混乱',4]],'天秤':[['親愛/感謝',5],['満足/歓喜',4]],'蠍':[['畏怖',5],['疑心/警戒',5]],'射手':[['興奮/恍惚',5],['興味/発見',4]],'山羊':[['尊敬',5],['冷静',4]],'水瓶':[['興味/発見',5],['妄想/空想',5]],'魚':[['妄想/空想',6],['畏怖',4]]}[lagnaShort]||[]).forEach(([e,b])=>addBonus(e,b));
    const NAK_PATTERNS = [
      [/リーダー|王者|権威|高貴/, [['興奮/恍惚',4],['怒り/憤慨',3]]],
      [/創造|芸術|魅力/, [['興味/発見',4],['妄想/空想',4]]],
      [/情熱|変革|革新/, [['興奮/恍惚',4],['怒り/憤慨',3]]],
      [/探究|知的|学習|広い視野/, [['興味/発見',5],['疑問/混乱',3]]],
      [/神秘|洞察|霊感|秘密/, [['畏怖',4],['妄想/空想',3]]],
      [/慈悲|献身|親しみ|友愛/, [['親愛/感謝',5],['尊敬',3]]],
      [/独立|自由|柔軟/, [['興味/発見',3],['驚き',3]]],
      [/安定|賢明|普遍/, [['満足/歓喜',3],['尊敬',3]]],
      [/活動的|冒険|決意|集中/, [['興奮/恍惚',4],['驚き',4]]],
      [/独創|実践|器用/, [['興味/発見',4],['興奮/恍惚',3]]],
      [/野心|音楽/, [['興奮/恍惚',3],['尊敬',3]]],
      [/癒し|養育|教育|保護/, [['親愛/感謝',4],['満足/歓喜',3]]]
    ];
    NAK_PATTERNS.forEach(([re, list]) => { if (re.test(nakshatraQuality)) list.forEach(([e,b]) => addBonus(e,b)); });
    ({'安住':[['満足/歓喜',5],['退屈',4],['冷静',3]],'破壊':[['怒り/憤慨',6],['軽蔑',4]],'栄達':[['興奮/恍惚',5],['尊敬',4],['驚き',3]],'親和':[['親愛/感謝',7],['尊敬',4]],'友好':[['満足/歓喜',4],['興味/発見',4]],'危機':[['不安/恐怖',6],['疑心/警戒',5]]}[sixGroups]||[]).forEach(([e,b])=>addBonus(e,b));
    ({'金':[['冷静',4],['尊敬',3]],'土':[['満足/歓喜',4],['尊敬',3]],'日':[['興奮/恍惚',4],['尊敬',3]],'月':[['妄想/空想',4],['悲しみ/落胆',3]],'火':[['怒り/憤慨',4],['興奮/恍惚',4]],'水':[['悲しみ/落胆',3],['冷静',4]],'木':[['興味/発見',4],['満足/歓喜',3]]}[shukuyoEl]||[]).forEach(([e,b])=>addBonus(e,b));

    rawList.forEach(e => { e.weight = Math.pow(e.weight, 5); });
    rawList.sort((a, b) => b.weight - a.weight);
    const top7 = rawList.slice(0, 7);
    const rest = rawList.slice(7);
    const restWeight = rest.reduce((s, e) => s + e.weight, 0);
    const total = top7.reduce((s, e) => s + e.weight, 0) + restWeight;
    let emotion = [...top7.map(e => ({ label: e.label, percent: (e.weight / total) * 100 })), { label: 'その他', percent: (restWeight / total) * 100 }];
    emotion = emotion.map(e => ({ ...e, percent: Math.round(e.percent * 10) / 10 }));
    const adjust = Math.round((100 - emotion.reduce((s, e) => s + e.percent, 0)) * 10) / 10;
    emotion[0].percent = Math.round((emotion[0].percent + adjust) * 10) / 10;
    return { personality, emotion };
  }

  // --- 9 つの宿曜関係（距離別、本命宿からの距離 mod 9） ---
  // 距離 0/9/18 は特別: 命/業/胎
  function calcShukuyoRelation(birthIdx, todayIdx) {
    const dist = ((todayIdx - birthIdx) % 27 + 27) % 27;
    if (dist === 0)  return { type: '命', label: '命の関係', desc: '自分自身を映す日、内省と自己確認に最適', level: 'best',    icon: '☀️' };
    if (dist === 9)  return { type: '業', label: '業の関係', desc: 'カルマを清算する日、過去の課題と向き合う', level: 'caution', icon: '🌥️' };
    if (dist === 18) return { type: '胎', label: '胎の関係', desc: '来世への種を蒔く日、新しい縁が生まれる', level: 'good',    icon: '🌤️' };

    const REL = [
      { type: '栄', label: '栄の関係', desc: '最良の発展日',           level: 'best',    icon: '☀️' },
      { type: '親', label: '親の関係', desc: '縁が深まる日',           level: 'good',    icon: '🌤️' },
      { type: '友', label: '友の関係', desc: '対等な仲間と動く日',     level: 'good',    icon: '🌤️' },
      { type: '衰', label: '衰の関係', desc: 'エネルギーが下がる日',   level: 'caution', icon: '🌥️' },
      { type: '安', label: '安の関係', desc: '穏やかで安定した日',     level: 'good',    icon: '🌤️' },
      { type: '危', label: '危の関係', desc: '試練と成長の日',         level: 'caution', icon: '🌥️' },
      { type: '成', label: '成の関係', desc: '成果を出せる日',         level: 'good',    icon: '🌤️' },
      { type: '壊', label: '壊の関係', desc: '破壊と再生の日',         level: 'caution', icon: '🌥️' }
    ];
    return REL[dist % 8];
  }

  // ----------------- ユーティリティ -----------------

  function loadProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return null;
      const p = JSON.parse(raw);
      if (!p || !p.birthYear || !p.birthMonth || !p.birthDay) return null;
      return p;
    } catch { return null; }
  }

  function getJSTToday() {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utcMs + 9 * 60 * 60000);
  }

  function dayDiff(year, month, day) {
    const base = new Date(1900, 0, 1).getTime();
    const target = new Date(year, month - 1, day).getTime();
    return Math.floor((target - base) / (1000 * 60 * 60 * 24));
  }

  function calcShukuyo(year, month, day) {
    const diff = dayDiff(year, month, day);
    const idx = ((diff % 27) + 27) % 27;
    return { ...SHUKUYO_27[idx], index: idx };
  }

  function calcDayPillar(year, month, day) {
    // 1900-01-01 = 甲戌 day (stem 0, branch 10)
    const diff = dayDiff(year, month, day);
    const stemIdx = ((diff % 10) + 10) % 10;
    const branchIdx = ((diff + 10) % 12 + 12) % 12;
    return {
      stem: HEAVENLY_STEMS[stemIdx],
      branch: EARTHLY_BRANCHES[branchIdx]
    };
  }

  function calcSevenLuminary(year, month, day) {
    return SEVEN_LUMINARIES[new Date(year, month - 1, day).getDay()];
  }

  // ----------------- ラッキー要素 -----------------
  const ELEMENT_LUCKY = {
    '木': { color: '緑・水色',  direction: '東',   time: '午前 5-7時',   number: '3 / 8' },
    '火': { color: '赤・ピンク', direction: '南',   time: '午前 11-13時', number: '2 / 7' },
    '土': { color: '黄・茶',    direction: '中央', time: '午後 1-3時',   number: '5 / 0' },
    '金': { color: '白・銀',    direction: '西',   time: '午後 5-7時',   number: '4 / 9' },
    '水': { color: '黒・青',    direction: '北',   time: '夜 23-1時',    number: '1 / 6' }
  };

  // ----------------- 本日の運勢生成 -----------------
  function generateToday(profile) {
    const today = getJSTToday();
    const ty = today.getFullYear();
    const tm = today.getMonth() + 1;
    const td = today.getDate();
    const dow = ['日', '月', '火', '水', '木', '金', '土'][today.getDay()];

    const todayShukuyo = calcShukuyo(ty, tm, td);
    const todayPillar  = calcDayPillar(ty, tm, td);
    const sevenLum     = calcSevenLuminary(ty, tm, td);

    const birthShukuyo = calcShukuyo(profile.birthYear, profile.birthMonth, profile.birthDay);
    const birthPillar  = calcDayPillar(profile.birthYear, profile.birthMonth, profile.birthDay);

    const relation = calcShukuyoRelation(birthShukuyo.index, todayShukuyo.index);
    const lucky    = ELEMENT_LUCKY[todayPillar.stem.element] || { color: '—', direction: '—', time: '—', number: '—' };

    // --- プロフィール基本データ ---
    const animalIdx = ((profile.birthYear - 4) % 12 + 12) % 12;
    const basic = {
      blood:         formatBloodType(profile.blood),
      zodiac:        calcZodiacSign(profile.birthMonth, profile.birthDay),
      chineseZodiac: `${ANIMAL_NAMES[animalIdx]}（${EARTHLY_BRANCHES[animalIdx].name}）`,
      mbti:          (profile.mbti && profile.mbti !== 'unknown') ? String(profile.mbti).toUpperCase() : '—'
    };

    // --- 性格傾向 + 感情 ---
    const birthMonthBranchIdx = ((profile.birthMonth + 1) % 12 + 12) % 12;
    const birthMonthBranch = EARTHLY_BRANCHES[birthMonthBranchIdx];
    const lagnaShort = calcLagnaShort(profile, profile.birthMonth, profile.birthDay);
    const nakshatraQuality = calcNakshatraQuality(profile.birthMonth, profile.birthDay).quality;
    const sixGroups = calcSixGroupsFromIdx(birthShukuyo.index);
    const tendency = calcTendency({
      profile,
      dayStem: birthPillar.stem,
      monthBranch: birthMonthBranch,
      lagnaShort,
      nakshatraQuality,
      sixGroups,
      shukuyoEl: birthShukuyo.element
    });

    return {
      date: `${tm}月${td}日（${dow}）`,
      sevenLum: `${sevenLum}曜`,
      todayShukuyo: todayShukuyo.name,
      todayShukuyoLuck: todayShukuyo.luck,
      relation,
      todayPillar: `${todayPillar.stem.name}${todayPillar.branch.name}`,
      todayElement: todayPillar.stem.element,
      todayYinYang: todayPillar.stem.yin_yang,
      birthShukuyo: birthShukuyo.name,
      birthPillar: `${birthPillar.stem.name}${birthPillar.branch.name}`,
      lucky,
      basic,
      tendency,
      overall: generateOverall(relation, todayShukuyo, todayPillar),
      career:  generateCareer(relation, todayPillar),
      love:    generateLove(relation, todayShukuyo),
      money:   generateMoney(relation, todayPillar, lucky),
      health:  generateHealth(relation, todayPillar)
    };
  }

  function levelTail(level, good, neutral, caution) {
    return level === 'best' ? good : level === 'good' ? neutral : caution;
  }

  function generateOverall(rel, todayShukuyo, todayPillar) {
    const stem = todayPillar.stem;
    const tail = levelTail(rel.level,
      '運気の波に乗って、大事な決断や行動を起こすのに最適な日です。',
      '穏やかで安定した運気の日。日常の積み重ねが運を育てます。',
      '波が立ちやすい日。慎重な判断と内省、休養に当てるのが吉です。');
    return `本日は宿曜では「${rel.label}」（${rel.desc}）に当たります。本日の宿は「${todayShukuyo.name}」（${todayShukuyo.luck}が強まる）、四柱推命では「${stem.name}${todayPillar.branch.name}」の${stem.element}の${stem.yin_yang}のエネルギーが流れます。${tail}`;
  }

  function generateCareer(rel, todayPillar) {
    const E = {
      '木': '企画力や成長戦略が冴える日。新規アイデアの発信が吉。',
      '火': 'プレゼンや営業など、人前で輝く活動が吉。',
      '土': '基盤を築く地道な作業や、信頼を厚くする行動が吉。',
      '金': '精密な作業や分析、専門性を磨く活動が成果に繋がります。',
      '水': 'クリエイティブな思考や研究、知的探究が冴える日。'
    };
    const tail = levelTail(rel.level,
      '大きな仕事や決断に挑戦すると成果が大きくなります。',
      '安定したペースで一歩ずつ進めるのが吉。',
      '無理せず、準備・下調べ・整理に当てるのが吉。');
    return `${E[todayPillar.stem.element] || ''}${tail}`;
  }

  function generateLove(rel, todayShukuyo) {
    const tail = levelTail(rel.level,
      '本音の対話や、新しい出会いを引き寄せやすい日。積極的に縁を求めてみてください。',
      '気の合う人とゆっくり時間を過ごすのに最適。共感を深めるチャンス。',
      'すれ違いやすい日。誤解を避けるため、丁寧なコミュニケーションを心がけて。');
    return `本日の宿「${todayShukuyo.name}」が示す${todayShukuyo.luck}が、人間関係や恋愛にも影響します。${tail}`;
  }

  function generateMoney(rel, todayPillar, lucky) {
    const E = {
      '木': '長期視点の投資や学びへの支出が運を引き寄せます。',
      '火': '直感が冴える日。ただし衝動買いには注意。',
      '土': 'コツコツ貯蓄や安定資産の見直しに最適。',
      '金': '副業や新しい収入源を探ると好結果が期待できます。',
      '水': '情報収集とタイミングの見極めが鍵となる日。'
    };
    const tail = levelTail(rel.level,
      'お金にまつわる大きな決断や投資判断にも適します。',
      '無理な支出を控え、堅実に動くのが吉。',
      '大きな出費や契約は避け、計画の見直し日に当てるのが吉。');
    return `${E[todayPillar.stem.element] || ''}${tail}本日のラッキーカラー「${lucky.color}」を財布や小物に取り入れると、金運アップに繋がります。`;
  }

  function generateHealth(rel, todayPillar) {
    const E = {
      '木': '肝臓や目のケアを意識。ストレッチや軽い運動が吉。',
      '火': '心臓や血行に注意。適度な有酸素運動と十分な休息のバランスを。',
      '土': '胃腸の調子に気を配って。消化に良い食事を心がけて。',
      '金': '呼吸器系のケアが重要。深呼吸の習慣と空気の良い環境を。',
      '水': '腎臓や水分バランスに注意。十分な水分補給と冷え対策を。'
    };
    const tail = levelTail(rel.level,
      '体調も整いやすい日。新しい運動や食習慣を始めるのに最適。',
      '無理せず、いつも通りのリズムを守るのが吉。',
      '疲れが溜まりやすい日。早めの休息と十分な睡眠を意識して。');
    return `${E[todayPillar.stem.element] || ''}${tail}`;
  }

  // ----------------- レンダリング -----------------
  function displayResult(r) {
    document.getElementById('astro-symbol').textContent  = r.relation.icon;
    document.getElementById('astro-title').textContent   = `${r.date}のあなた`;
    document.getElementById('astro-subtitle').textContent = `${r.relation.label} × ${r.todayElement}の${r.todayYinYang}`;

    document.getElementById('astro-chart').innerHTML = renderBlocks(r);

    document.getElementById('astro-overall').textContent = r.overall;
    document.getElementById('astro-career').textContent  = r.career;
    document.getElementById('astro-love').textContent    = r.love;
    document.getElementById('astro-money').textContent   = r.money;
    document.getElementById('astro-health').textContent  = r.health;
  }

  // ----------------- AI解釈エンハンス（/api/fortune） -----------------
  // テンプレ表示後に非同期でAI鑑定文を取得し、取得できたら差し替える。
  // 失敗・未デプロイ時は何もしない（テンプレ文がそのまま残る）。
  function buildFortunePayload(profile, r) {
    const t = getJSTToday();
    const pad = n => String(n).padStart(2, '0');
    return {
      layer: 'hack',
      tier: 'free',
      date: `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`,
      profile: {
        mbti:  (profile.mbti && profile.mbti !== 'unknown') ? String(profile.mbti).toUpperCase() : null,
        job:   profile.job || null,
        blood: profile.blood || null,
        birthYearOnly: profile.birthYear || null
      },
      calculated: {
        fourPillars: { todayPillar: r.todayPillar, element: r.todayElement, yinYang: r.todayYinYang, birthPillar: r.birthPillar },
        shukuyo: {
          today: r.todayShukuyo, todayLuck: r.todayShukuyoLuck, birth: r.birthShukuyo,
          relation: { type: r.relation.type, label: r.relation.label, level: r.relation.level }
        },
        basic: r.basic,
        lucky: r.lucky
      }
    };
  }

  async function enhanceWithAI(profile, r) {
    if (typeof window.xtenFetchFortune !== 'function') return;
    const data = await window.xtenFetchFortune(buildFortunePayload(profile, r));
    if (!data || !Array.isArray(data.sections)) return;   // 失敗時はテンプレ表示のまま

    const byKey = {};
    data.sections.forEach(s => { if (s && s.key) byKey[s.key] = s.body; });
    const set = (id, txt) => { if (txt) { const el = document.getElementById(id); if (el) el.textContent = txt; } };
    set('astro-overall', byKey.overall);
    set('astro-career',  byKey.career);
    set('astro-love',    byKey.love);
    set('astro-money',   byKey.money);
    set('astro-health',  byKey.health);
  }

  function renderBlocks(r) {
    const item = (label, value) => `
      <div class="astro-block__item">
        <div class="astro-block__label">${label}</div>
        <div class="astro-block__value">${value}</div>
      </div>`;

    const levelLabel = r.relation.level === 'best' ? '最良' : r.relation.level === 'good' ? '良好' : '要注意';

    // Block 0: プロフィール基本データ
    const block0 = `
      <section class="astro-block astro-block--joined-down">
        <h3 class="astro-block__title">プロフィール基本データ</h3>
        <div class="astro-block__grid">
          ${item('血液型', r.basic.blood)}
          ${item('星座',   r.basic.zodiac)}
          ${item('干支',   r.basic.chineseZodiac)}
          ${item('MBTI',  r.basic.mbti)}
        </div>
      </section>` + renderTendencyBlock(r.tendency);

    // Block 四柱推命
    const todayStemName   = r.todayPillar.charAt(0);
    const todayBranchName = r.todayPillar.charAt(1);
    const blockFourPillars = `
      <section class="astro-block">
        <h3 class="astro-block__title">本日の四柱推命</h3>
        <div class="astro-block__grid">
          ${item('本日の日柱',   r.todayPillar)}
          ${item('本日の天干',   todayStemName)}
          ${item('本日の地支',   todayBranchName)}
          ${item('本日の五行',   r.todayElement)}
          ${item('本日の陰陽',   r.todayYinYang)}
          ${item('本命日柱',     r.birthPillar)}
        </div>
      </section>`;

    // Block 宿曜
    const blockShukuyo = `
      <section class="astro-block">
        <h3 class="astro-block__title">本日の宿曜占星術</h3>
        <div class="astro-block__grid">
          ${item('日付',              r.date)}
          ${item('七曜',              r.sevenLum)}
          ${item('本日の宿',          r.todayShukuyo)}
          ${item('運気の強み',        r.todayShukuyoLuck)}
          ${item('本命宿',            r.birthShukuyo)}
          ${item('本命宿との関係',    r.relation.type + 'の関係')}
        </div>
      </section>`;

    // Block 統合判定
    const blockIntegration = `
      <section class="astro-block">
        <h3 class="astro-block__title">統合判定（四柱推命 × 宿曜）</h3>
        <div class="astro-block__grid">
          ${item('四柱推命の流れ',   `${r.todayElement}の${r.todayYinYang}`)}
          ${item('宿曜の関係',       r.relation.label)}
          ${item('運勢レベル',       levelLabel)}
          ${item('本日の判定',       `${r.relation.type} × ${r.todayElement}`)}
        </div>
      </section>`;

    // Block ラッキー
    const blockLucky = `
      <section class="astro-block">
        <h3 class="astro-block__title">本日のラッキー要素</h3>
        <div class="astro-block__grid">
          ${item('ラッキーカラー', r.lucky.color)}
          ${item('ラッキー方角',   r.lucky.direction)}
          ${item('ラッキータイム', r.lucky.time)}
          ${item('ラッキー数字',   r.lucky.number)}
        </div>
      </section>`;

    return block0 + blockFourPillars + blockShukuyo + blockIntegration + blockLucky;
  }

  // 性格傾向 + 感情円グラフ（astrology.js と同じ構造）
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

    const EMOTION_COLORS = t.emotion.map((_, i) => `hsl(${Math.floor((i * 360) / 8)}, 55%, 60%)`);
    const cx = 300, cy = 230, r = 150;
    const elbowR = r + 24;
    const sideOffset = 70;
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
      const px = cx + r * Math.cos(midRad);
      const py = cy + r * Math.sin(midRad);
      const ex = cx + elbowR * Math.cos(midRad);
      const ey = cy + elbowR * Math.sin(midRad);
      const isRight = mid < 180;
      const sx = isRight ? ex + sideOffset : ex - sideOffset;
      const sy = ey;
      const leader = `<polyline points="${px},${py} ${ex},${ey} ${sx},${sy}" class="emotion-chart__leader"/>`;
      const tx = isRight ? sx + 6 : sx - 6;
      const anchor = isRight ? 'start' : 'end';
      const label = `
        <text class="emotion-chart__label-name"    x="${tx}" y="${sy - 4}" text-anchor="${anchor}">${e.label}</text>
        <text class="emotion-chart__label-percent" x="${tx}" y="${sy + 13}" text-anchor="${anchor}">${e.percent.toFixed(1)}%</text>
      `;
      return path + leader + label;
    }).join('');

    return `
      <section class="astro-block astro-block--tendency astro-block--joined-up">
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

  // ----------------- 初期化 -----------------
  document.addEventListener('DOMContentLoaded', () => {
    const profile = loadProfile();
    const loadingEl   = document.getElementById('phase-loading');
    const resultEl    = document.getElementById('phase-result');
    const noProfileEl = document.getElementById('phase-no-profile');

    if (!profile) {
      if (loadingEl)   loadingEl.classList.add('hidden');
      if (noProfileEl) noProfileEl.classList.remove('hidden');
      return;
    }

    const result = generateToday(profile);

    setTimeout(() => {
      displayResult(result);
      if (loadingEl) loadingEl.classList.add('hidden');
      if (resultEl)  resultEl.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // テンプレ表示後、AI鑑定文が取れれば差し替える（失敗してもテンプレが残る）
      enhanceWithAI(profile, result);
    }, 1200);
  });

  // ----------------- シェア -----------------
  window.todayShareTwitter = function () {
    const text = encodeURIComponent('本日の x-TEN 診断結果をチェック！\n');
    const url  = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };
  window.todayShareThreads = function () {
    const text = encodeURIComponent('本日の x-TEN 診断結果をチェック！');
    window.open(`https://www.threads.net/intent/post?text=${text}`, '_blank');
  };
})();
