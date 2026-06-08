// ======================================================
// 今年の診断結果 - 四柱推命 × インド占星術
// xten.profile を読み、今年の運勢の流れ + 勝負期 + 注意期を生成
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
    { name: '子', animal: '鼠', element: '水' },
    { name: '丑', animal: '牛', element: '土' },
    { name: '寅', animal: '虎', element: '木' },
    { name: '卯', animal: '兎', element: '木' },
    { name: '辰', animal: '龍', element: '土' },
    { name: '巳', animal: '蛇', element: '火' },
    { name: '午', animal: '馬', element: '火' },
    { name: '未', animal: '羊', element: '土' },
    { name: '申', animal: '猿', element: '金' },
    { name: '酉', animal: '鶏', element: '金' },
    { name: '戌', animal: '犬', element: '土' },
    { name: '亥', animal: '猪', element: '水' }
  ];

  // --- インド占星術: ナクシャトラ(27宿) ---
  const NAKSHATRAS = [
    { name: 'アシュヴィニー',           deity: 'アシュヴィン双神' },
    { name: 'バラニー',                 deity: 'ヤマ' },
    { name: 'クリッティカー',           deity: 'アグニ' },
    { name: 'ローヒニー',               deity: 'ブラフマー' },
    { name: 'ムリガシーラ',             deity: 'ソーマ' },
    { name: 'アールドラー',             deity: 'ルドラ' },
    { name: 'プナルヴァス',             deity: 'アディティ' },
    { name: 'プシュヤ',                 deity: 'ブリハスパティ' },
    { name: 'アーシュレーシャ',         deity: 'ナーガ' },
    { name: 'マガー',                   deity: 'ピトリ' },
    { name: 'プールヴァ・パルグニー',   deity: 'バガ' },
    { name: 'ウッタラ・パルグニー',     deity: 'アリヤマン' },
    { name: 'ハスタ',                   deity: 'サヴィトリ' },
    { name: 'チトラー',                 deity: 'トヴァシュトリ' },
    { name: 'スヴァーティー',           deity: 'ヴァーユ' },
    { name: 'ヴィシャーカー',           deity: 'インドラ・アグニ' },
    { name: 'アヌラーダー',             deity: 'ミトラ' },
    { name: 'ジェーシュター',           deity: 'インドラ' },
    { name: 'ムーラ',                   deity: 'ニルリティ' },
    { name: 'プールヴァ・アシャーダー', deity: 'アパス' },
    { name: 'ウッタラ・アシャーダー',   deity: 'ヴィシュヴェーデーヴァ' },
    { name: 'シュラヴァナ',             deity: 'ヴィシュヌ' },
    { name: 'ダニシュター',             deity: 'ヴァス' },
    { name: 'シャタビシャ',             deity: 'ヴァルナ' },
    { name: 'プールヴァ・バードラパダー', deity: 'アジャ・エーカパード' },
    { name: 'ウッタラ・バードラパダー', deity: 'アヒル・ブドニャ' },
    { name: 'レーヴァティー',           deity: 'プーシャン' }
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

  // --- 大運 10 年サイクルのテーマ ---
  const YEAR_THEMES_10 = [
    '基盤を見直し土台を築く年',
    '新しい出会いと芽吹きの年',
    '上昇と拡大の発展期',
    '実りを収穫する充実期',
    '転換と再編の調整期',
    '内省と再充電の静養期',
    '再起と改革の挑戦期',
    '飛躍と挑戦の冒険期',
    '達成と評価の頂点期',
    '締めくくりと次の準備期'
  ];

  // --- 五行の相生・相克 ---
  const SHENG = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const KE    = { '木': '土', '土': '水', '水': '火', '火': '金', '金': '木' };

  // --- 三合 (triangular harmony) と 六沖 (opposite/conflict) ---
  const TRINE_GROUPS = [
    ['申', '子', '辰'],  // 水局
    ['寅', '午', '戌'],  // 火局
    ['亥', '卯', '未'],  // 木局
    ['巳', '酉', '丑']   // 金局
  ];
  const CONFLICT = {
    '子': '午', '午': '子', '丑': '未', '未': '丑',
    '寅': '申', '申': '寅', '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳'
  };

  // --- 惑星別ラッキー要素 ---
  const PLANET_LUCKY = {
    '太陽':     { color: 'ゴールド・オレンジ', direction: '東',   season: '夏',   number: '1 / 9' },
    '月':       { color: 'シルバー・白',       direction: '北西', season: '初秋', number: '2 / 7' },
    '火星':     { color: '赤・朱',             direction: '南',   season: '初夏', number: '9 / 3' },
    '水星':     { color: '緑・青緑',           direction: '北',   season: '春',   number: '5 / 8' },
    '木星':     { color: '黄・金',             direction: '東北', season: '晩秋', number: '3 / 6' },
    '金星':     { color: '白・ピンク',         direction: '南東', season: '初春', number: '6 / 8' },
    '土星':     { color: '青・黒',             direction: '西',   season: '冬',   number: '8 / 7' },
    'ラーフ':   { color: '深紅・グレー',       direction: '南西', season: '梅雨', number: '4 / 8' },
    'ケートゥ': { color: '紫・茶',             direction: '南西', season: '晩夏', number: '7 / 5' }
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

  function calcHeavenlyStem(year) {
    return HEAVENLY_STEMS[((year - 4) % 10 + 10) % 10];
  }

  function calcEarthlyBranch(year) {
    return EARTHLY_BRANCHES[((year - 4) % 12 + 12) % 12];
  }

  function calcCalendarMonthBranch(month) {
    // Jan(1)=丑, Feb(2)=寅, ..., Dec(12)=子
    return EARTHLY_BRANCHES[month % 12];
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

  // 五行の関係を判定（私の元素 → 相手の元素）
  function calcElementRelation(myEl, theirEl) {
    if (myEl === theirEl)                  return { type: 'same',      desc: '比和（同気・安定）',         level: 'good' };
    if (SHENG[myEl] === theirEl)           return { type: 'shengOut',  desc: '相手を生じる（私が育てる）', level: 'good' };
    if (SHENG[theirEl] === myEl)           return { type: 'shengIn',   desc: '相手から生じられる（吉）',   level: 'best' };
    if (KE[myEl] === theirEl)              return { type: 'keOut',     desc: '相手を克する（挑戦）',       level: 'caution' };
    if (KE[theirEl] === myEl)              return { type: 'keIn',      desc: '相手から克される（試練）',   level: 'caution' };
    return { type: 'none', desc: '中立', level: 'good' };
  }

  // 干支の三合関係（私の本命支と相手の支）
  function getTrineBranches(birthBranchName) {
    for (const group of TRINE_GROUPS) {
      if (group.includes(birthBranchName)) {
        return group.filter(b => b !== birthBranchName);
      }
    }
    return [];
  }

  // ----------------- 年間解析 -----------------

  function analyzeYear(profile) {
    const today = getJSTToday();
    const year  = today.getFullYear();
    const age   = year - profile.birthYear;

    // 本命四柱（年柱のみ簡略）
    const birthStem    = calcHeavenlyStem(profile.birthYear);
    const birthBranch  = calcEarthlyBranch(profile.birthYear);

    // 今年の年柱
    const yearStem     = calcHeavenlyStem(year);
    const yearBranch   = calcEarthlyBranch(year);

    // 五行の相性（本命 × 今年）
    const elementRel   = calcElementRelation(birthStem.element, yearStem.element);

    // 大運（10 年周期テーマ）
    const daiunTheme   = YEAR_THEMES_10[((age) % 10 + 10) % 10];

    // 月別の勝負期・注意期を判定（地支の三合・六沖）
    const trines       = getTrineBranches(birthBranch.name);
    const conflictName = CONFLICT[birthBranch.name];
    const peakMonths    = [];
    const cautionMonths = [];
    const sameMonth     = [];
    for (let m = 1; m <= 12; m++) {
      const mBranch = calcCalendarMonthBranch(m);
      if (trines.includes(mBranch.name))             peakMonths.push(m);
      else if (mBranch.name === conflictName)        cautionMonths.push(m);
      else if (mBranch.name === birthBranch.name)    sameMonth.push(m);
    }

    // インド占星術
    const nakshatra = calcNakshatra(profile.birthMonth, profile.birthDay);
    const dasha     = calcDasha(profile.birthYear);

    // 年全体の運勢レベル
    const levelData =
      elementRel.level === 'best'                            ? { level: 'best',    icon: '🌟', desc: '飛躍の年' }
      : elementRel.level === 'good' && elementRel.type !== 'keIn' ? { level: 'good',    icon: '🌤️', desc: '安定の年' }
      :                                                              { level: 'caution', icon: '🌥️', desc: '挑戦と充電の年' };

    // ラッキー要素は現在のダシャー惑星から
    const lucky = PLANET_LUCKY[dasha.planet] || { color: '—', direction: '—', season: '—', number: '—' };

    return {
      year, age,
      birthPillar:  `${birthStem.name}${birthBranch.name}`,
      birthElement: birthStem.element,
      birthAnimal:  birthBranch.animal,
      yearPillar:   `${yearStem.name}${yearBranch.name}`,
      yearElement:  yearStem.element,
      yearAnimal:   yearBranch.animal,
      elementRel,
      daiunTheme,
      peakMonths,
      cautionMonths,
      sameMonth,
      nakshatra:    nakshatra.name,
      deity:        nakshatra.deity,
      dasha:        dasha.name,
      dashaPlanet:  dasha.planet,
      level:        levelData.level,
      levelIcon:    levelData.icon,
      levelDesc:    levelData.desc,
      lucky,
      overall: generateOverall(levelData, elementRel, daiunTheme, peakMonths, cautionMonths, dasha),
      career:  generateCareer(levelData, daiunTheme, dasha),
      love:    generateLove(levelData, nakshatra, peakMonths),
      money:   generateMoney(levelData, dasha, lucky),
      health:  generateHealth(levelData, daiunTheme)
    };
  }

  // ----------------- テキスト生成 -----------------

  function listMonths(arr, n) {
    return arr.length > 0
      ? arr.slice(0, n).map(m => `${m}月`).join('・')
      : 'なし';
  }

  function generateOverall(lvl, elRel, daiunTheme, peakMonths, cautionMonths, dasha) {
    const peaks    = listMonths(peakMonths, 4);
    const cautions = listMonths(cautionMonths, 3);
    const tail = lvl.level === 'best'
      ? '飛躍の波が来る一年。勝負期に大きな行動を起こすと運気が大きく開けます。'
      : lvl.level === 'good'
      ? '安定した一年。地に足をつけ、長期的な計画を進めるのに最適です。'
      : '挑戦と充電の一年。無理せず、勝負月に集中して動くのが吉。';
    return `今年は四柱推命では「${daiunTheme}」、本命との五行関係は「${elRel.desc}」、インド占星術ではダシャー「${dasha.name}」の影響下にあります。勝負期として注目すべきは ${peaks}、要注意期は ${cautions}。${tail}`;
  }

  function generateCareer(lvl, daiunTheme, dasha) {
    const tail = lvl.level === 'best'
      ? '大きなプロジェクトや転職、起業の判断に最適な年。'
      : lvl.level === 'good'
      ? '実績を積み上げ、信頼を厚くする活動に最適な年。'
      : '次のキャリアに向けた準備と学び直しに当てるのが吉。';
    return `「${daiunTheme}」というテーマの一年。ダシャー「${dasha.name}」の${dasha.planet}的特性が仕事の方向性を導きます。${tail}`;
  }

  function generateLove(lvl, nakshatra, peakMonths) {
    const peaks = listMonths(peakMonths, 3);
    const tail = lvl.level === 'best'
      ? '新しい縁や関係の発展が期待できる年です。'
      : lvl.level === 'good'
      ? '既存の関係を深め、信頼を厚くするのに最適。'
      : '相手の状況を尊重し、距離感を大切にするのが吉。';
    return `${nakshatra.name}（${nakshatra.deity}の守護）を持つあなたは、特に ${peaks} に縁が動きやすい時期。${tail}`;
  }

  function generateMoney(lvl, dasha, lucky) {
    const tail = lvl.level === 'best'
      ? '大きな投資や資産形成の判断に最適な年。'
      : lvl.level === 'good'
      ? '堅実な貯蓄と計画的な投資が実を結ぶ年。'
      : '無駄な出費を控え、家計の見直しに当てるのが吉。';
    return `今年のラッキーカラー「${lucky.color}」を取り入れると金運アップ。ダシャー「${dasha.name}」の影響で${tail}`;
  }

  function generateHealth(lvl, daiunTheme) {
    const tail = lvl.level === 'best'
      ? '体調も上向きやすい年。新しい習慣を定着させるのに最適。'
      : lvl.level === 'good'
      ? '通常のリズムを守りつつ、定期的なメンテナンスを意識して。'
      : '十分な休息と睡眠を最優先に。無理は禁物の年です。';
    return `「${daiunTheme}」という流れの中で、心身のバランスを意識しましょう。${tail}`;
  }

  // ----------------- レンダリング -----------------

  function displayResult(r) {
    document.getElementById('astro-symbol').textContent   = r.levelIcon;
    document.getElementById('astro-title').textContent    = `${r.year}年（${r.age}歳）のあなた`;
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

    // Block 1: 四柱推命のみ
    const block1 = `
      <section class="astro-block">
        <h3 class="astro-block__title">今年の四柱推命</h3>
        <div class="astro-block__grid">
          ${item('今年の年柱',     r.yearPillar)}
          ${item('今年の干支',     `${r.yearAnimal}年`)}
          ${item('今年の五行',     r.yearElement)}
          ${item('本命年柱',       r.birthPillar)}
          ${item('五行の相性',     r.elementRel.desc)}
          ${item('大運テーマ',     r.daiunTheme)}
        </div>
      </section>`;

    // Block 2: インド占星術のみ
    const block2 = `
      <section class="astro-block">
        <h3 class="astro-block__title">今年のインド占星術</h3>
        <div class="astro-block__grid">
          ${item('本命ナクシャトラ', r.nakshatra)}
          ${item('守護神',           r.deity)}
          ${item('現在のダシャー',   r.dasha)}
          ${item('支配惑星',         r.dashaPlanet)}
          ${item('年間の象徴',       `${r.dashaPlanet}的テーマの一年`)}
        </div>
      </section>`;

    // Block 3: 四柱推命 × インド占星術 統合判定
    const block3 = `
      <section class="astro-block">
        <h3 class="astro-block__title">統合判定（四柱推命 × インド占星術）</h3>
        <div class="astro-block__grid">
          ${item('年間運勢レベル',   r.levelDesc)}
          ${item('勝負期 (三合月)',  listMonths(r.peakMonths, 4))}
          ${item('要注意期 (六沖)',  listMonths(r.cautionMonths, 3))}
          ${item('本命月',           listMonths(r.sameMonth, 1))}
        </div>
      </section>`;

    // Block 4: 今年のラッキー要素
    const block4 = `
      <section class="astro-block">
        <h3 class="astro-block__title">今年のラッキー要素</h3>
        <div class="astro-block__grid">
          ${item('ラッキーカラー',   r.lucky.color)}
          ${item('ラッキー方角',     r.lucky.direction)}
          ${item('ラッキー季節',     r.lucky.season)}
          ${item('ラッキー数字',     r.lucky.number)}
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

    const result = analyzeYear(profile);

    setTimeout(() => {
      displayResult(result);
      if (loadingEl) loadingEl.classList.add('hidden');
      if (resultEl)  resultEl.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  });

  // ----------------- シェア -----------------

  window.yearShareTwitter = function () {
    const text = encodeURIComponent('今年の x-TEN 診断結果をチェック！\n');
    const url  = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };
  window.yearShareThreads = function () {
    const text = encodeURIComponent('今年の x-TEN 診断結果をチェック！');
    window.open(`https://www.threads.net/intent/post?text=${text}`, '_blank');
  };
})();
