/* ============================================
   BOLD EDITORIAL FORTUNE - SCRIPT
   Weekly Zodiac Ranking with seed-based RNG
   ============================================ */

(function () {
  'use strict';

  // ---- ZODIAC DATA ----

  var signs = [
    {
      name: '牡羊座',
      en: 'Aries',
      dates: '3/21 - 4/19',
      symbol: '\u2648',
      keyword: '新しい挑戦',
      message: '今週は大胆な一歩を踏み出すタイミング。周囲の評価を気にせず、自分の直感を信じて行動することで、思いがけない展開が待っています。火曜日以降、コミュニケーション運が急上昇。',
      luckyColor: 'スカーレット',
      luckyNumber: 7
    },
    {
      name: '牡牛座',
      en: 'Taurus',
      dates: '4/20 - 5/20',
      symbol: '\u2649',
      keyword: '美意識',
      message: '審美眼が冴え渡る一週間。ファッションやインテリアなど、美に関する判断が的確に。金曜日には思いがけない臨時収入の暗示も。贅沢を恐れず、本物を選ぶ目を信じて。',
      luckyColor: 'エメラルド',
      luckyNumber: 3
    },
    {
      name: '双子座',
      en: 'Gemini',
      dates: '5/21 - 6/21',
      symbol: '\u264A',
      keyword: '言葉の力',
      message: 'あなたの言葉が人の心を動かす週。プレゼンやSNSでの発信が注目を集めそう。水曜日は特に知的好奇心が高まり、新しい学びとの出会いが期待できます。',
      luckyColor: 'レモンイエロー',
      luckyNumber: 5
    },
    {
      name: '蟹座',
      en: 'Cancer',
      dates: '6/22 - 7/22',
      symbol: '\u264B',
      keyword: '居場所づくり',
      message: '家庭や仲間との絆が深まる暗示。心地よい空間づくりに力を注ぐと、精神的な安定感が増します。木曜日のディナーが特別な記憶になる予感。大切な人との時間を優先して。',
      luckyColor: 'シルバー',
      luckyNumber: 2
    },
    {
      name: '獅子座',
      en: 'Leo',
      dates: '7/23 - 8/22',
      symbol: '\u264C',
      keyword: '主役の輝き',
      message: '注目を浴びることで運気が上昇する週。自信を持ってステージに立つ姿勢が幸運を呼びます。週末にかけてクリエイティブなエネルギーが最高潮に。遠慮は今週の敵。',
      luckyColor: 'ゴールド',
      luckyNumber: 1
    },
    {
      name: '乙女座',
      en: 'Virgo',
      dates: '8/23 - 9/22',
      symbol: '\u264D',
      keyword: '完璧な段取り',
      message: '細部への目配りが成功の鍵。計画を丁寧に立てることで、大きなプロジェクトがスムーズに進みます。健康面では食生活の見直しが吉。月曜日にルーティンを整えると一週間が好転。',
      luckyColor: 'ネイビー',
      luckyNumber: 6
    },
    {
      name: '天秤座',
      en: 'Libra',
      dates: '9/23 - 10/23',
      symbol: '\u264E',
      keyword: 'パートナーシップ',
      message: '対人関係で素晴らしいシンクロが起きる予感。ビジネスでも恋愛でも、相手との調和を意識することで最高の結果に。木曜日は交渉事に最適。美しいバランスを追求して。',
      luckyColor: 'ローズピンク',
      luckyNumber: 8
    },
    {
      name: '蠍座',
      en: 'Scorpio',
      dates: '10/24 - 11/22',
      symbol: '\u264F',
      keyword: '変容',
      message: '深い洞察力が冴える一週間。表面的なことに惑わされず、本質を見抜く力が高まっています。火曜日に手放すべきものが明確になる暗示。変化を恐れないことが飛躍の鍵。',
      luckyColor: 'ボルドー',
      luckyNumber: 9
    },
    {
      name: '射手座',
      en: 'Sagittarius',
      dates: '11/23 - 12/21',
      symbol: '\u2650',
      keyword: '冒険心',
      message: '未知の領域への探求心が幸運を運ぶ週。旅行や留学の計画は今週中にアクションを。水曜日以降、海外や異文化に関連する嬉しいニュースが届きそう。視野を広く持って。',
      luckyColor: 'ターコイズ',
      luckyNumber: 4
    },
    {
      name: '山羊座',
      en: 'Capricorn',
      dates: '12/22 - 1/19',
      symbol: '\u2651',
      keyword: 'キャリアアップ',
      message: '仕事運が好調。これまでの努力が認められる場面がありそうです。金曜日には重要な決断を迫られる可能性も。長期的なビジョンを持って、着実にステップアップを。',
      luckyColor: 'チャコール',
      luckyNumber: 10
    },
    {
      name: '水瓶座',
      en: 'Aquarius',
      dates: '1/20 - 2/18',
      symbol: '\u2652',
      keyword: 'イノベーション',
      message: '独創的なアイデアが次々と浮かぶ創造的な一週間。常識にとらわれない発想が評価される暗示。テクノロジーとの相性が抜群。月曜日に始めたプロジェクトが大化けする予感。',
      luckyColor: 'エレクトリックブルー',
      luckyNumber: 11
    },
    {
      name: '魚座',
      en: 'Pisces',
      dates: '2/19 - 3/20',
      symbol: '\u2653',
      keyword: '直感力',
      message: 'スピリチュアルな感性が最大限に高まる時期。夢や直感を大切にすると、驚くような導きを受け取れそう。芸術に触れることが心の栄養に。週末は一人の時間で内面を充実させて。',
      luckyColor: 'ラベンダー',
      luckyNumber: 12
    }
  ];

  // ---- WEEK CALCULATION ----

  function getWeekStart() {
    var now = new Date();
    var day = now.getDay();
    var diff = now.getDate() - day + (day === 0 ? -6 : 1);
    var monday = new Date(now);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  function getWeekEnd(monday) {
    var sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return sunday;
  }

  function formatDate(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return y + '.' + m + '.' + dd;
  }

  function getWeekSeed() {
    var monday = getWeekStart();
    return monday.getFullYear() * 10000 + (monday.getMonth() + 1) * 100 + monday.getDate();
  }

  // ---- SEEDED RNG ----

  function seededRandom(seed) {
    var s = seed;
    return function () {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  // ---- SCORE GENERATION ----

  function generateScores(rng) {
    var ranked = signs.map(function (sign, i) {
      var overall = Math.floor(rng() * 35) + 65;
      var love = Math.floor(rng() * 40) + 60;
      var work = Math.floor(rng() * 40) + 60;
      var money = Math.floor(rng() * 40) + 60;
      return {
        index: i,
        name: sign.name,
        en: sign.en,
        dates: sign.dates,
        symbol: sign.symbol,
        keyword: sign.keyword,
        message: sign.message,
        luckyColor: sign.luckyColor,
        luckyNumber: sign.luckyNumber,
        overall: overall,
        love: love,
        work: work,
        money: money
      };
    });

    ranked.sort(function (a, b) {
      return b.overall - a.overall;
    });

    return ranked;
  }

  // ---- FORMAT HELPERS ----

  function padRank(n) {
    return n < 10 ? '0' + n : String(n);
  }

  // ---- RENDER RANKING ----

  function renderRanking(ranked) {
    var container = document.getElementById('ranking-list');
    container.innerHTML = '';

    ranked.forEach(function (item, rank) {
      var rankNum = rank + 1;

      if (rankNum === 1) {
        container.appendChild(renderHero(item, rankNum));
      } else if (rankNum <= 3) {
        container.appendChild(renderMedium(item, rankNum));
      } else {
        container.appendChild(renderCompact(item, rankNum));
      }
    });
  }

  function renderHero(item, rankNum) {
    var el = document.createElement('div');
    el.className = 'rank-hero';
    el.innerHTML =
      '<div class="hero-accent-bar"></div>' +
      '<div class="hero-inner">' +
      '<p class="hero-rank-label">THIS WEEK\'S NO.</p>' +
      '<div class="hero-rank-number">' + padRank(rankNum) + '</div>' +
      '<div class="hero-sign-name">' + item.name + '</div>' +
      '<div class="hero-sign-en">' + item.en + '</div>' +
      '<div class="hero-score">' + item.overall + '<span class="score-unit">pt</span></div>' +
      '<p class="hero-keyword-label">KEYWORD OF THE WEEK</p>' +
      '<p class="hero-keyword">' + item.keyword + '</p>' +
      '<p class="hero-message">' + item.message + '</p>' +
      '</div>';
    el.addEventListener('click', function () {
      showDetail(item, rankNum);
    });
    return el;
  }

  function renderMedium(item, rankNum) {
    var el = document.createElement('div');
    el.className = 'rank-medium';
    el.innerHTML =
      '<div class="medium-rank">' + padRank(rankNum) + '</div>' +
      '<div class="medium-body">' +
      '<div class="medium-sign-name">' + item.name + '</div>' +
      '<div class="medium-sign-en">' + item.en + '</div>' +
      '<div class="medium-score">' + item.overall + '<span class="score-unit">pt</span></div>' +
      '<p class="medium-message">' + item.message + '</p>' +
      '</div>';
    el.addEventListener('click', function () {
      showDetail(item, rankNum);
    });
    return el;
  }

  function renderCompact(item, rankNum) {
    var el = document.createElement('div');
    el.className = 'rank-compact';

    var shortFortune = item.message.length > 20
      ? item.message.substring(0, 20) + '...'
      : item.message;

    el.innerHTML =
      '<div class="compact-rank">' + rankNum + '</div>' +
      '<div class="compact-sign">' + item.name + '</div>' +
      '<div class="compact-fortune">' + shortFortune + '</div>' +
      '<div class="compact-score">' + item.overall + '<span class="score-unit">pt</span></div>';
    el.addEventListener('click', function () {
      showDetail(item, rankNum);
    });
    return el;
  }

  // ---- DETAIL VIEW ----

  function showDetail(item, rankNum) {
    var container = document.getElementById('detail-content');

    container.innerHTML =
      '<a class="detail-back" id="back-top">BACK TO RANKING</a>' +

      '<p class="detail-rank-label">RANK</p>' +
      '<div class="detail-rank-number">' + padRank(rankNum) + '</div>' +
      '<div class="detail-sign-name">' + item.name + '</div>' +
      '<div class="detail-sign-en">' + item.en + '</div>' +
      '<div class="detail-sign-dates">' + item.dates + '</div>' +

      '<div class="detail-line"></div>' +

      '<div class="detail-score-hero">' +
      '<p class="score-label">TOTAL SCORE</p>' +
      '<div class="score-value">' + item.overall + '<span class="score-unit-large">pt</span></div>' +
      '</div>' +

      '<div class="detail-categories">' +
      renderCatItem('\u7DCF\u5408', 'OVERALL', item.overall) +
      renderCatItem('LOVE', 'LOVE', item.love) +
      renderCatItem('WORK', 'WORK', item.work) +
      renderCatItem('MONEY', 'MONEY', item.money) +
      '</div>' +

      '<div class="detail-keyword-section">' +
      '<p class="kw-label">KEYWORD OF THE WEEK</p>' +
      '<p class="kw-value">' + item.keyword + '</p>' +
      '</div>' +

      '<div class="detail-message-section">' +
      '<p class="msg-label">THIS WEEK\'S MESSAGE</p>' +
      '<p class="msg-text">' + item.message + '</p>' +
      '</div>' +

      '<div class="detail-lucky">' +
      '<div class="detail-lucky-item">' +
      '<p class="lucky-label">LUCKY COLOR</p>' +
      '<p class="lucky-value">' + item.luckyColor + '</p>' +
      '</div>' +
      '<div class="detail-lucky-item">' +
      '<p class="lucky-label">LUCKY NUMBER</p>' +
      '<p class="lucky-value">' + item.luckyNumber + '</p>' +
      '</div>' +
      '</div>' +

      '<a class="detail-back-bottom" id="back-bottom">BACK TO RANKING</a>';

    // Switch views
    switchView('detail');

    // Bind back buttons
    document.getElementById('back-top').addEventListener('click', function () {
      switchView('ranking');
    });
    document.getElementById('back-bottom').addEventListener('click', function () {
      switchView('ranking');
    });
  }

  function renderCatItem(label, enLabel, score) {
    return '<div class="detail-cat-item">' +
      '<p class="cat-label">' + enLabel + '</p>' +
      '<div class="cat-score">' + score + '<span class="cat-unit">pt</span></div>' +
      '</div>';
  }

  // ---- VIEW SWITCHING ----

  function switchView(target) {
    var rankingView = document.getElementById('ranking-view');
    var detailView = document.getElementById('detail-view');

    if (target === 'detail') {
      rankingView.classList.remove('active');
      setTimeout(function () {
        detailView.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
      detailView.classList.remove('active');
      setTimeout(function () {
        rankingView.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }
  }

  // ---- INIT ----

  function init() {
    // Set week range
    var monday = getWeekStart();
    var sunday = getWeekEnd(monday);
    document.getElementById('week-range').textContent =
      formatDate(monday) + ' \u2014 ' + formatDate(sunday).slice(5);

    // Generate and render
    var seed = getWeekSeed();
    var rng = seededRandom(seed);
    var ranked = generateScores(rng);
    renderRanking(ranked);
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
