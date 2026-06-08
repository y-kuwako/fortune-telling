// ======================================================
// 今月の診断結果 - インド占星術 × 宿曜占星術
// xten.profile を読み、今月の運勢の波 + 勝負日 + 要注意日を生成
// ======================================================

(function () {
  'use strict';

  const PROFILE_KEY = 'xten.profile';

  // --- 27宿（宿曜） ---
  const SHUKUYO_27 = [
    { name: '昴宿' }, { name: '畢宿' }, { name: '觜宿' },
    { name: '参宿' }, { name: '井宿' }, { name: '鬼宿' },
    { name: '柳宿' }, { name: '星宿' }, { name: '張宿' },
    { name: '翼宿' }, { name: '軫宿' }, { name: '角宿' },
    { name: '亢宿' }, { name: '氐宿' }, { name: '房宿' },
    { name: '心宿' }, { name: '尾宿' }, { name: '箕宿' },
    { name: '斗宿' }, { name: '女宿' }, { name: '虚宿' },
    { name: '危宿' }, { name: '室宿' }, { name: '壁宿' },
    { name: '奎宿' }, { name: '婁宿' }, { name: '胃宿' }
  ];

  // --- インド占星術: ナクシャトラ(27宿) ---
  const NAKSHATRAS = [
    { name: 'アシュヴィニー',          deity: 'アシュヴィン双神' },
    { name: 'バラニー',                deity: 'ヤマ' },
    { name: 'クリッティカー',          deity: 'アグニ' },
    { name: 'ローヒニー',              deity: 'ブラフマー' },
    { name: 'ムリガシーラ',            deity: 'ソーマ' },
    { name: 'アールドラー',            deity: 'ルドラ' },
    { name: 'プナルヴァス',            deity: 'アディティ' },
    { name: 'プシュヤ',                deity: 'ブリハスパティ' },
    { name: 'アーシュレーシャ',        deity: 'ナーガ' },
    { name: 'マガー',                  deity: 'ピトリ' },
    { name: 'プールヴァ・パルグニー',  deity: 'バガ' },
    { name: 'ウッタラ・パルグニー',    deity: 'アリヤマン' },
    { name: 'ハスタ',                  deity: 'サヴィトリ' },
    { name: 'チトラー',                deity: 'トヴァシュトリ' },
    { name: 'スヴァーティー',          deity: 'ヴァーユ' },
    { name: 'ヴィシャーカー',          deity: 'インドラ・アグニ' },
    { name: 'アヌラーダー',            deity: 'ミトラ' },
    { name: 'ジェーシュター',          deity: 'インドラ' },
    { name: 'ムーラ',                  deity: 'ニルリティ' },
    { name: 'プールヴァ・アシャーダー', deity: 'アパス' },
    { name: 'ウッタラ・アシャーダー',  deity: 'ヴィシュヴェーデーヴァ' },
    { name: 'シュラヴァナ',            deity: 'ヴィシュヌ' },
    { name: 'ダニシュター',            deity: 'ヴァス' },
    { name: 'シャタビシャ',            deity: 'ヴァルナ' },
    { name: 'プールヴァ・バードラパダー', deity: 'アジャ・エーカパード' },
    { name: 'ウッタラ・バードラパダー', deity: 'アヒル・ブドニャ' },
    { name: 'レーヴァティー',          deity: 'プーシャン' }
  ];

  // --- ヴィムショッタリ・ダシャー（120 年周期、9 惑星） ---
  const DASHAS = [
    { name: 'ケートゥ期', years: 7,  planet: 'ケートゥ' },
    { name: '金星期',     years: 20, planet: '金星'     },
    { name: '太陽期',     years: 6,  planet: '太陽'     },
    { name: '月期',       years: 10, planet: '月'       },
    { name: '火星期',     years: 7,  planet: '火星'     },
    { name: 'ラーフ期',   years: 18, planet: 'ラーフ'   },
    { name: '木星期',     years: 16, planet: '木星'     },
    { name: '土星期',     years: 19, planet: '土星'     },
    { name: '水星期',     years: 17, planet: '水星'     }
  ];

  // --- 月別の太陽運行（簡易: 太陽星座と支配星） ---
  const MONTHLY_FOCUS = {
    1:  { sign: '山羊', planet: '土星',   element: '土', theme: '基盤を固める月' },
    2:  { sign: '水瓶', planet: '土星',   element: '土', theme: '革新と独創の月' },
    3:  { sign: '魚',   planet: '木星',   element: '水', theme: '直感と慈愛の月' },
    4:  { sign: '牡羊', planet: '火星',   element: '火', theme: '新規挑戦の月'   },
    5:  { sign: '牡牛', planet: '金星',   element: '土', theme: '美と豊かさの月' },
    6:  { sign: '双子', planet: '水星',   element: '風', theme: '学びと交流の月' },
    7:  { sign: '蟹',   planet: '月',     element: '水', theme: '家族と感情の月' },
    8:  { sign: '獅子', planet: '太陽',   element: '火', theme: '創造と表現の月' },
    9:  { sign: '乙女', planet: '水星',   element: '土', theme: '整理と分析の月' },
    10: { sign: '天秤', planet: '金星',   element: '風', theme: '関係性調和の月' },
    11: { sign: '蠍',   planet: '火星',   element: '水', theme: '変容と探究の月' },
    12: { sign: '射手', planet: '木星',   element: '火', theme: '冒険と拡大の月' }
  };

  // --- 支配惑星別のラッキー要素 ---
  const PLANET_LUCKY = {
    '太陽':     { color: 'ゴールド・オレンジ', direction: '東',   time: '午前 11-13時', number: '1 / 9' },
    '月':       { color: 'シルバー・白',       direction: '北西', time: '夜 23-1時',    number: '2 / 7' },
    '火星':     { color: '赤・朱',             direction: '南',   time: '午前 5-7時',   number: '9 / 3' },
    '水星':     { color: '緑・青緑',           direction: '北',   time: '午前 9-11時',  number: '5 / 8' },
    '木星':     { color: '黄・金',             direction: '東北', time: '午後 3-5時',   number: '3 / 6' },
    '金星':     { color: '白・ピンク',         direction: '南東', time: '午後 1-3時',   number: '6 / 8' },
    '土星':     { color: '青・黒',             direction: '西',   time: '夜 19-21時',   number: '8 / 7' },
    'ラーフ':   { color: '深紅・グレー',       direction: '南西', time: '夕方 17-19時', number: '4 / 8' },
    'ケートゥ': { color: '紫・茶',             direction: '南西', time: '夜 21-23時',   number: '7 / 5' }
  };

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

  function calcNakshatra(month, day) {
    const dayOfYear = (month - 1) * 30 + day;
    return NAKSHATRAS[dayOfYear % 27];
  }

  function calcDasha(birthYear) {
    const age = new Date().getFullYear() - birthYear;
    let mod = ((age % 120) + 120) % 120;
    let acc = 0;
    for (const d of DASHAS) {
      acc += d.years;
      if (mod < acc) return d;
    }
    return DASHAS[0];
  }

  // 宿曜の関係（本命宿と任意の日付の宿との距離から）
  function calcShukuyoRelation(birthIdx, dayIdx) {
    const dist = ((dayIdx - birthIdx) % 27 + 27) % 27;
    if (dist === 0)  return { type: '命', label: '命の関係',     level: 'best' };
    if (dist === 9)  return { type: '業', label: '業の関係',     level: 'caution' };
    if (dist === 18) return { type: '胎', label: '胎の関係',     level: 'good' };

    const REL = [
      { type: '栄', label: '栄の関係', level: 'best' },
      { type: '親', label: '親の関係', level: 'good' },
      { type: '友', label: '友の関係', level: 'good' },
      { type: '衰', label: '衰の関係', level: 'caution' },
      { type: '安', label: '安の関係', level: 'good' },
      { type: '危', label: '危の関係', level: 'caution' },
      { type: '成', label: '成の関係', level: 'good' },
      { type: '壊', label: '壊の関係', level: 'caution' }
    ];
    return REL[dist % 8];
  }

  // ----------------- 月間解析 -----------------

  function analyzeMonth(profile) {
    const today = getJSTToday();
    const year  = today.getFullYear();
    const month = today.getMonth() + 1;

    const birthShukuyo = calcShukuyo(profile.birthYear, profile.birthMonth, profile.birthDay);

    // 当月の日数
    const daysInMonth = new Date(year, month, 0).getDate();

    // 1 ヶ月分の宿曜関係を走査
    const bestDays    = [];
    const goodDays    = [];
    const cautionDays = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dayShukuyo = calcShukuyo(year, month, d);
      const rel = calcShukuyoRelation(birthShukuyo.index, dayShukuyo.index);
      const entry = { date: d, type: rel.type, label: rel.label };
      if      (rel.level === 'best')    bestDays.push(entry);
      else if (rel.level === 'good')    goodDays.push(entry);
      else                              cautionDays.push(entry);
    }

    // インド占星術
    const nakshatra = calcNakshatra(profile.birthMonth, profile.birthDay);
    const dasha     = calcDasha(profile.birthYear);
    const focus     = MONTHLY_FOCUS[month] || { sign: '—', planet: '—', element: '—', theme: '—' };

    // 月全体の判定
    const goodPct = (bestDays.length + goodDays.length) / daysInMonth * 100;
    const levelData =
      goodPct >= 65 ? { level: 'best',    icon: '🌟', desc: '飛躍の月' }
    : goodPct >= 45 ? { level: 'good',    icon: '🌤️', desc: '安定の月' }
    :                 { level: 'caution', icon: '🌥️', desc: '充電の月' };

    // ラッキー要素は現在のダシャー惑星から
    const lucky = PLANET_LUCKY[dasha.planet] || { color: '—', direction: '—', time: '—', number: '—' };

    return {
      year, month, daysInMonth,
      bestDays, goodDays, cautionDays,
      bestCount:    bestDays.length,
      goodCount:    goodDays.length,
      cautionCount: cautionDays.length,
      nakshatra:    nakshatra.name,
      deity:        nakshatra.deity,
      dasha:        dasha.name,
      dashaPlanet:  dasha.planet,
      focus,
      level:        levelData.level,
      levelIcon:    levelData.icon,
      levelDesc:    levelData.desc,
      lucky,
      birthShukuyo: birthShukuyo.name,
      overall: generateOverall(levelData, bestDays, cautionDays, dasha, focus),
      career:  generateCareer(levelData, dasha, focus),
      love:    generateLove(levelData, nakshatra, focus),
      money:   generateMoney(levelData, dasha, lucky),
      health:  generateHealth(levelData, focus)
    };
  }

  // ----------------- テキスト生成 -----------------

  function listDays(arr, n) {
    return arr.length > 0
      ? arr.slice(0, n).map(d => `${d.date}日`).join('・')
      : 'なし';
  }

  function generateOverall(lvl, bestDays, cautionDays, dasha, focus) {
    const bestList    = listDays(bestDays, 3);
    const cautionList = listDays(cautionDays, 3);
    const tail = lvl.level === 'best'
      ? '飛躍の波が来ている月。チャンスを逃さないよう、勝負日に大きな行動を起こすと運気が大きく開けます。'
      : lvl.level === 'good'
      ? '安定した月。地に足をつけて、コツコツ積み上げる活動が吉です。'
      : '充電と整理の月。無理せず、勝負日のみに集中して動くのが吉です。';
    return `今月は宿曜占星術での「${lvl.desc}」、インド占星術ではダシャー「${dasha.name}」の影響、太陽は「${focus.sign}」を運行中（${focus.theme}）。勝負日として注目すべきは ${bestList}、要注意日は ${cautionList}。${tail}`;
  }

  function generateCareer(lvl, dasha, focus) {
    const tail = lvl.level === 'best'
      ? '大きなプロジェクトの着手や、重要な決断を下すのに最適。'
      : lvl.level === 'good'
      ? '安定して積み上げる仕事が成果を出します。'
      : '休息と内省、次の準備期間に当てるのが吉。';
    return `${focus.theme}がテーマの月。ダシャー「${dasha.name}」の${dasha.planet}的特性を仕事に活かしましょう。${tail}`;
  }

  function generateLove(lvl, nakshatra, focus) {
    const tail = lvl.level === 'best'
      ? '新しい出会いや関係の深まりが期待できる月です。'
      : lvl.level === 'good'
      ? '既存の関係を大切に育てるのに最適。'
      : '無理せず、相手の状況を尊重する姿勢が吉。';
    return `${nakshatra.name}（${nakshatra.deity}の守護）を持つあなたは、太陽が${focus.sign}を運行する今月、${tail}`;
  }

  function generateMoney(lvl, dasha, lucky) {
    const tail = lvl.level === 'best'
      ? '副業や投資の判断が冴える月。'
      : lvl.level === 'good'
      ? '堅実な貯蓄や計画的な支出が吉。'
      : '大きな出費は控え、家計の見直し期間に当てるのが吉。';
    return `今月のラッキーカラー「${lucky.color}」を取り入れると、金運アップ。ダシャー「${dasha.name}」の影響で${tail}`;
  }

  function generateHealth(lvl, focus) {
    const tail = lvl.level === 'best'
      ? '新しい運動や食生活を始めるのに最適。'
      : lvl.level === 'good'
      ? '通常のリズムを守りつつ、軽い運動を継続するのが吉。'
      : '十分な休息と睡眠を最優先に。';
    return `太陽が${focus.sign}を運行する今月は、${focus.element}の気が強まる時期。${tail}`;
  }

  // ----------------- レンダリング -----------------

  function displayResult(r) {
    document.getElementById('astro-symbol').textContent   = r.levelIcon;
    document.getElementById('astro-title').textContent    = `${r.month}月のあなた`;
    document.getElementById('astro-subtitle').textContent = `${r.levelDesc} × ${r.dasha}`;

    document.getElementById('astro-chart').innerHTML = renderBlocks(r);

    document.getElementById('astro-overall').textContent = r.overall;
    document.getElementById('astro-career').textContent  = r.career;
    document.getElementById('astro-love').textContent    = r.love;
    document.getElementById('astro-money').textContent   = r.money;
    document.getElementById('astro-health').textContent  = r.health;
  }

  function renderBlocks(r) {
    const item = (label, value) => `
      <div class="astro-block__item">
        <div class="astro-block__label">${label}</div>
        <div class="astro-block__value">${value}</div>
      </div>`;

    // Block 1: インド占星術 のみ
    const block1 = `
      <section class="astro-block">
        <h3 class="astro-block__title">今月のインド占星術</h3>
        <div class="astro-block__grid">
          ${item('本命ナクシャトラ', r.nakshatra)}
          ${item('守護神',           r.deity)}
          ${item('現在のダシャー',   r.dasha)}
          ${item('太陽の運行',       `${r.focus.sign}（${r.focus.planet}支配）`)}
          ${item('月のテーマ',       r.focus.theme)}
        </div>
      </section>`;

    // Block 2: 宿曜占星術 のみ
    const block2 = `
      <section class="astro-block">
        <h3 class="astro-block__title">今月の宿曜占星術</h3>
        <div class="astro-block__grid">
          ${item('本命宿',           r.birthShukuyo)}
          ${item('勝負日数 (栄/命)', `${r.bestCount} 日`)}
          ${item('安定日数',         `${r.goodCount} 日`)}
          ${item('要注意日数',       `${r.cautionCount} 日`)}
          ${item('注目の勝負日',     listDays(r.bestDays, 3))}
        </div>
      </section>`;

    // Block 3: インド × 宿曜 統合判定
    const block3 = `
      <section class="astro-block">
        <h3 class="astro-block__title">統合判定（インド占星術 × 宿曜占星術）</h3>
        <div class="astro-block__grid">
          ${item('月間運勢レベル',   r.levelDesc)}
          ${item('ダシャー期テーマ', r.dashaPlanet)}
          ${item('月のテーマ',       r.focus.theme)}
          ${item('要注意日',         listDays(r.cautionDays, 3))}
        </div>
      </section>`;

    // Block 4: 今月のラッキー要素
    const block4 = `
      <section class="astro-block">
        <h3 class="astro-block__title">今月のラッキー要素</h3>
        <div class="astro-block__grid">
          ${item('ラッキーカラー', r.lucky.color)}
          ${item('ラッキー方角',   r.lucky.direction)}
          ${item('ラッキータイム', r.lucky.time)}
          ${item('ラッキー数字',   r.lucky.number)}
        </div>
      </section>`;

    return block1 + block2 + block3 + block4;
  }

  // ----------------- 初期化 -----------------

  document.addEventListener('DOMContentLoaded', () => {
    const profile     = loadProfile();
    const loadingEl   = document.getElementById('phase-loading');
    const resultEl    = document.getElementById('phase-result');
    const noProfileEl = document.getElementById('phase-no-profile');

    if (!profile) {
      if (loadingEl)   loadingEl.classList.add('hidden');
      if (noProfileEl) noProfileEl.classList.remove('hidden');
      return;
    }

    const result = analyzeMonth(profile);

    setTimeout(() => {
      displayResult(result);
      if (loadingEl) loadingEl.classList.add('hidden');
      if (resultEl)  resultEl.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  });

  // ----------------- シェア -----------------

  window.monthShareTwitter = function () {
    const text = encodeURIComponent('今月の x-TEN 診断結果をチェック！\n');
    const url  = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };
  window.monthShareLine = function () {
    const text = encodeURIComponent('今月の x-TEN 診断結果をチェック！');
    window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
  };
})();
