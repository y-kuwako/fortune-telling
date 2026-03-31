/* ============================================
   運命星占い - Destiny Star Fortune
   ============================================ */

(function () {
  'use strict';

  // ── Elements ──
  var form = document.getElementById('fortuneForm');
  var yearSelect = document.getElementById('birthYear');
  var monthSelect = document.getElementById('birthMonth');
  var daySelect = document.getElementById('birthDay');
  var loading = document.getElementById('loading');
  var resultSection = document.getElementById('resultSection');
  var retryBtn = document.getElementById('retryBtn');

  // ── 12 Destiny Star Types ──
  var STAR_TYPES = [
    { name: '水星人プラス', symbol: '☿', element: '水' },
    { name: '水星人マイナス', symbol: '☿', element: '水' },
    { name: '金星人プラス', symbol: '♀', element: '金' },
    { name: '金星人マイナス', symbol: '♀', element: '金' },
    { name: '火星人プラス', symbol: '♂', element: '火' },
    { name: '火星人マイナス', symbol: '♂', element: '火' },
    { name: '天王星人プラス', symbol: '⛢', element: '天' },
    { name: '天王星人マイナス', symbol: '⛢', element: '天' },
    { name: '土星人プラス', symbol: '♄', element: '土' },
    { name: '土星人マイナス', symbol: '♄', element: '土' },
    { name: '木星人プラス', symbol: '♃', element: '木' },
    { name: '木星人マイナス', symbol: '♃', element: '木' }
  ];

  // ── Fortune Cycle Types ──
  var CYCLES = {
    blessing: { label: '好運期', className: 'blessing' },
    normal: { label: '普通', className: 'normal' },
    caution: { label: '注意期', className: 'caution' },
    danger: { label: '大殺界', className: 'danger' }
  };

  // ── Lucky Colors ──
  var LUCKY_COLORS = [
    '深紅', '黄金', '漆黒', '翡翠', '藍色',
    '紫紺', '白銀', '茜色', '琥珀', '薄墨',
    '珊瑚', '群青'
  ];

  // ── Lucky Directions ──
  var LUCKY_DIRECTIONS = [
    '北', '北東', '東', '南東', '南', '南西', '西', '北西'
  ];

  // ── Fortune Texts by Cycle ──
  var FORTUNE_TEXTS = {
    blessing: [
      'あなたの運気は今、最高潮に達しています。星の加護のもと、新しい挑戦が大きな実りをもたらすでしょう。直感を信じて行動することで、思いもよらない幸運が舞い込みます。人との出会いにも恵まれ、大切なご縁が生まれる時期です。',
      '天の星があなたに強い光を注いでいます。長年の努力が実を結び、周囲からの評価が高まるでしょう。この好機を逃さず、大きな決断を下すのに最適な時期です。心の声に従い、勇気を持って前に進んでください。',
      '運命の歯車があなたに有利に回り始めました。金運、仕事運ともに上昇し、思い描いた理想に近づける時期です。周囲の人々との調和を大切にすることで、さらなる幸運を引き寄せることができるでしょう。'
    ],
    normal: [
      '現在の運気は安定しています。大きな変化は訪れませんが、日々の積み重ねが未来の好運につながります。焦らず、地道な努力を続けることが吉です。心身のバランスを整え、内面の充実を図る時期と心得ましょう。',
      '星の動きは穏やかで、静かな成長の時期を示しています。派手な成果は望めませんが、基盤を固めるには最適です。学びと準備に時間を費やすことで、次の好運期に大きく飛躍できるでしょう。',
      '運気は中庸を保っています。この時期は自分自身と向き合い、内なる声に耳を傾けることが重要です。急いで結果を求めず、じっくりと計画を練り直すことで、より確かな道が開けてきます。'
    ],
    caution: [
      '星の配置が注意を促しています。些細なミスが大きな問題に発展しやすい時期です。重要な判断は慎重に行い、信頼できる人に相談することをお勧めします。健康面にも気を配り、無理をしないことが肝要です。',
      '運気に微かな乱れが見られます。対人関係においてすれ違いが生じやすく、言葉選びに注意が必要です。この時期は守りの姿勢を心がけ、大きな投資や契約は控えた方が賢明でしょう。',
      '星があなたに慎重さを求めています。思い通りにならないことが続くかもしれませんが、それは成長のための試練です。忍耐強く、冷静な判断を心がけることで、やがて道は開けてきます。'
    ],
    danger: [
      '大殺界の影響が色濃く出ています。あらゆる面で困難が生じやすい時期です。新しいことを始めるのは避け、現状維持に徹することが最善策です。この試練を乗り越えることで、来たるべき好運期に大きな飛躍が待っています。心身の浄化を心がけ、静かに過ごすことをお勧めします。',
      '運命の暗転期に入っています。予期せぬトラブルや人間関係の摩擦が起こりやすい時期です。大きな決断や転機は避け、守りに徹してください。この厳しい時期は必ず終わりを迎えます。今は忍耐の時と心得て、心の平穏を保つことに集中しましょう。',
      '星の警告が最も強い時期です。判断力が鈍りやすく、冷静さを失いがちです。重要な契約や人生の転機となる決断は、この時期を過ぎてから行うことを強くお勧めします。信頼できる人のそばにいることで、困難を和らげることができるでしょう。'
    ]
  };

  // ── Cycle Messages ──
  var CYCLE_MESSAGES = {
    blessing: '✦ 好運期 ✦\nあなたは今、星の祝福を受けています。\nこの好機を最大限に活かしてください。',
    normal: '穏やかな星のもとにあります。\n焦らず、着実に歩みを進める時期です。',
    caution: '⚠ 注意期 ⚠\n慎重な行動が求められています。\n大きな決断は控え、静かに過ごしましょう。',
    danger: '🔥 大殺界 🔥\n試練の時期です。新たな挑戦は避け、\n心身の浄化に努めてください。\nこの嵐は必ず過ぎ去ります。'
  };

  // ── Star Personality Traits ──
  var STAR_TRAITS = {
    '水': '知性と柔軟性に優れ、深い洞察力を持つ',
    '金': '華やかさと美的感覚に恵まれ、人を惹きつける魅力がある',
    '火': '情熱と行動力に満ち、リーダーシップを発揮する',
    '天': '独創性と革新性を持ち、時代を先取りする感性がある',
    '土': '堅実さと忍耐力を備え、着実に目標を達成する力がある',
    '木': '包容力と成長力を持ち、周囲を豊かにする存在である'
  };

  // ── Initialize Dropdowns ──
  function initDropdowns() {
    var currentYear = new Date().getFullYear();
    for (var y = currentYear; y >= 1930; y--) {
      var opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y + '年';
      yearSelect.appendChild(opt);
    }
    for (var m = 1; m <= 12; m++) {
      var opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m + '月';
      monthSelect.appendChild(opt);
    }
    for (var d = 1; d <= 31; d++) {
      var opt = document.createElement('option');
      opt.value = d;
      opt.textContent = d + '日';
      daySelect.appendChild(opt);
    }
  }

  // ── Seed-based random (deterministic per birthday + date) ──
  function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  // ── Calculate Destiny Star from birthday ──
  function calculateDestinyStar(year, month, day) {
    // Numerological calculation inspired by 六星占術
    var sum = 0;
    var dateStr = '' + year + month + day;
    for (var i = 0; i < dateStr.length; i++) {
      sum += parseInt(dateStr[i], 10);
    }
    // Reduce to destiny number
    while (sum > 12) {
      var temp = 0;
      var s = '' + sum;
      for (var i = 0; i < s.length; i++) {
        temp += parseInt(s[i], 10);
      }
      sum = temp;
    }
    // Adjust for plus/minus based on year parity
    var index = ((sum - 1) % 6) * 2;
    if (year % 2 === 0) {
      index += 1; // マイナス
    }
    return STAR_TYPES[index];
  }

  // ── Calculate Fortune Cycle ──
  function calculateCycle(year, month, day) {
    var today = new Date();
    var birthDate = new Date(year, month - 1, day);
    var ageInDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    var cyclePosition = ageInDays % 12;

    if (cyclePosition <= 3) {
      return 'blessing';
    } else if (cyclePosition <= 7) {
      return 'normal';
    } else if (cyclePosition <= 9) {
      return 'caution';
    } else {
      return 'danger';
    }
  }

  // ── Generate Fortune Ratings ──
  function generateRatings(year, month, day, cycle) {
    var today = new Date();
    var baseSeed = year * 10000 + month * 100 + day +
      today.getFullYear() * 100 + today.getMonth() * 10 + today.getDate();

    var cycleBonus = { blessing: 2, normal: 0, caution: -1, danger: -3 };
    var bonus = cycleBonus[cycle];

    function rating(offset) {
      var raw = Math.floor(seededRandom(baseSeed + offset) * 6) + 3 + bonus;
      return Math.max(1, Math.min(10, raw));
    }

    return {
      overall: rating(1),
      love: rating(2),
      work: rating(3),
      money: rating(4),
      health: rating(5)
    };
  }

  // ── Generate Lucky Items ──
  function generateLuckyItems(year, month, day) {
    var today = new Date();
    var seed = year + month * 31 + day * 367 +
      today.getFullYear() + today.getMonth() + today.getDate();

    var colorIdx = Math.floor(seededRandom(seed + 100) * LUCKY_COLORS.length);
    var dirIdx = Math.floor(seededRandom(seed + 200) * LUCKY_DIRECTIONS.length);
    var number = Math.floor(seededRandom(seed + 300) * 99) + 1;

    return {
      color: LUCKY_COLORS[colorIdx],
      direction: LUCKY_DIRECTIONS[dirIdx],
      number: number
    };
  }

  // ── Select Fortune Text ──
  function selectFortuneText(year, month, day, cycle, element) {
    var today = new Date();
    var seed = year + month + day + today.getDate();
    var texts = FORTUNE_TEXTS[cycle];
    var idx = Math.floor(seededRandom(seed) * texts.length);
    var trait = STAR_TRAITS[element];
    return texts[idx] + '\n\nあなたは生まれながらに' + trait + '。その才能を信じ、自らの道を切り拓いてください。';
  }

  // ── Animate Fortune Bars ──
  function animateBars(ratings) {
    var bars = [
      { id: 'fillOverall', valueId: 'barOverall', val: ratings.overall },
      { id: 'fillLove', valueId: 'barLove', val: ratings.love },
      { id: 'fillWork', valueId: 'barWork', val: ratings.work },
      { id: 'fillMoney', valueId: 'barMoney', val: ratings.money },
      { id: 'fillHealth', valueId: 'barHealth', val: ratings.health }
    ];

    bars.forEach(function (bar, i) {
      var fillEl = document.getElementById(bar.id);
      var valueEl = document.getElementById(bar.valueId);

      fillEl.style.width = '0%';
      valueEl.textContent = '';

      setTimeout(function () {
        fillEl.style.width = (bar.val * 10) + '%';
        valueEl.textContent = bar.val + ' / 10';
      }, 200 + i * 150);
    });
  }

  // ── Display Result ──
  function displayResult(year, month, day) {
    var star = calculateDestinyStar(year, month, day);
    var cycle = calculateCycle(year, month, day);
    var ratings = generateRatings(year, month, day, cycle);
    var lucky = generateLuckyItems(year, month, day);
    var fortuneText = selectFortuneText(year, month, day, cycle, star.element);
    var cycleInfo = CYCLES[cycle];

    // Star info
    document.getElementById('starSymbol').textContent = star.symbol;
    document.getElementById('starName').textContent = star.name;

    // Cycle badge
    var badge = document.getElementById('cycleBadge');
    badge.textContent = cycleInfo.label;
    badge.className = 'cycle-badge ' + cycleInfo.className;

    // Fortune bars
    animateBars(ratings);

    // Fortune text
    document.getElementById('fortuneText').textContent = fortuneText;

    // Lucky items
    document.getElementById('luckyColor').textContent = lucky.color;
    document.getElementById('luckyNumber').textContent = lucky.number;
    document.getElementById('luckyDirection').textContent = lucky.direction;

    // Cycle message
    var msgEl = document.getElementById('cycleMessage');
    msgEl.textContent = CYCLE_MESSAGES[cycle];
    msgEl.className = 'cycle-message ' + cycleInfo.className;

    // Show result
    resultSection.classList.add('active');
    loading.classList.remove('active');

    // Scroll to result
    setTimeout(function () {
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  // ── Form Submit ──
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var year = parseInt(yearSelect.value, 10);
    var month = parseInt(monthSelect.value, 10);
    var day = parseInt(daySelect.value, 10);

    if (!year || !month || !day) return;

    // Hide form, show loading
    resultSection.classList.remove('active');
    loading.classList.add('active');

    // Simulate star reading delay
    setTimeout(function () {
      displayResult(year, month, day);
    }, 1800);
  });

  // ── Retry ──
  retryBtn.addEventListener('click', function () {
    resultSection.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Init ──
  initDropdowns();

})();
