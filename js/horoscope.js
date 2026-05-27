/* ========================================
   天推 AI - 12星座占い (Horoscope)
   ======================================== */

(function () {
  'use strict';

  // 12星座データ
  const ZODIAC_SIGNS = [
    { name: '牡羊座', nameEn: 'Aries', symbol: '♈', dateRange: '3/21 - 4/19', element: '火' },
    { name: '牡牛座', nameEn: 'Taurus', symbol: '♉', dateRange: '4/20 - 5/20', element: '地' },
    { name: '双子座', nameEn: 'Gemini', symbol: '♊', dateRange: '5/21 - 6/21', element: '風' },
    { name: '蟹座', nameEn: 'Cancer', symbol: '♋', dateRange: '6/22 - 7/22', element: '水' },
    { name: '獅子座', nameEn: 'Leo', symbol: '♌', dateRange: '7/23 - 8/22', element: '火' },
    { name: '乙女座', nameEn: 'Virgo', symbol: '♍', dateRange: '8/23 - 9/22', element: '地' },
    { name: '天秤座', nameEn: 'Libra', symbol: '♎', dateRange: '9/23 - 10/23', element: '風' },
    { name: '蠍座', nameEn: 'Scorpio', symbol: '♏', dateRange: '10/24 - 11/22', element: '水' },
    { name: '射手座', nameEn: 'Sagittarius', symbol: '♐', dateRange: '11/23 - 12/21', element: '火' },
    { name: '山羊座', nameEn: 'Capricorn', symbol: '♑', dateRange: '12/22 - 1/19', element: '地' },
    { name: '水瓶座', nameEn: 'Aquarius', symbol: '♒', dateRange: '1/20 - 2/18', element: '風' },
    { name: '魚座', nameEn: 'Pisces', symbol: '♓', dateRange: '2/19 - 3/20', element: '水' },
  ];

  // ラッキーカラー候補
  const LUCKY_COLORS = [
    'レッド', 'ブルー', 'グリーン', 'イエロー', 'パープル',
    'オレンジ', 'ピンク', 'ホワイト', 'ゴールド', 'シルバー',
    'ネイビー', 'ブラウン', 'ラベンダー', 'エメラルド', 'コーラル',
    'アイボリー', 'ターコイズ', 'ローズ', 'ワインレッド', 'スカイブルー',
  ];

  // 今日のメッセージ候補
  const MESSAGES = [
    '新しい出会いの予感があります。心を開いて周囲に接してみましょう。思いがけない展開が待っているかもしれません。',
    '直感が冴える一日です。迷った時こそ自分の心の声に耳を傾けてみてください。きっと正しい道が見えてくるでしょう。',
    '積み重ねてきた努力が実を結ぶ時期です。焦らず一歩一歩進んでいけば、大きな成果を手にすることができるでしょう。',
    '人間関係に変化の兆しがあります。古い縁が復活したり、新しいつながりが生まれる可能性があります。',
    '創造力が高まる日です。アイデアを形にするチャンスが訪れます。思い切って行動に移してみましょう。',
    '穏やかなエネルギーに包まれる一日です。自分自身を労わる時間を大切にしてください。心身のバランスが整います。',
    '挑戦の好機が巡ってきます。リスクを恐れず前に進むことで、新たな可能性が広がるでしょう。',
    '周囲からのサポートに恵まれる日です。素直に助けを求めることで、物事がスムーズに進みます。',
    '長年の悩みに光が差す暗示があります。視点を変えることで、解決の糸口が見つかるかもしれません。',
    'コミュニケーション運が好調です。自分の思いを伝えることで、深い絆が築かれるでしょう。',
    '金運の流れが変わる兆しがあります。堅実な判断を心がけることで、着実に豊かさを引き寄せることができます。',
    '学びの意欲が高まる日です。新しい知識やスキルを身につけることで、将来の可能性が広がります。',
    '過去の経験が活きる場面がありそうです。これまでの道のりに自信を持って、堂々と進んでください。',
    '家族や大切な人との時間が幸運をもたらします。感謝の気持ちを言葉にして伝えてみましょう。',
    '変化を受け入れる柔軟さが鍵になります。固定観念を手放すことで、新しい世界が広がります。',
    '自分磨きに最適な日です。外見だけでなく内面も整えることで、自信が高まり運気も上昇するでしょう。',
    '仕事で嬉しい知らせが届く予感です。日頃の誠実な姿勢が評価される時が来ています。',
    '旅行や外出が幸運を呼び込みます。いつもと違う場所で、素敵な発見があるかもしれません。',
    '忍耐が試される場面がありそうですが、乗り越えた先には大きな成長が待っています。',
    '芸術や音楽に触れることで、心が豊かになる日です。感性を大切にして過ごしましょう。',
    '健康運が上昇しています。新しい運動や食生活の改善を始めるのに良いタイミングです。',
    '思いやりの心が幸運を引き寄せます。周囲への気配りが巡り巡ってあなたに戻ってくるでしょう。',
    '決断を求められる場面がありそうです。情報をしっかり集めた上で、自分の直感を信じて進みましょう。',
    '隠れた才能が開花する予感があります。普段やらないことに挑戦してみると、意外な発見があるでしょう。',
  ];

  /**
   * 日付をシードにした疑似乱数生成器
   * 同じ日付・同じ星座なら同じ結果を返す
   */
  function seededRandom(seed) {
    let s = seed;
    return function () {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  /**
   * 今日の日付シードを取得
   */
  function getDateSeed() {
    const now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  }

  /**
   * 星座別の運勢を生成
   */
  function generateFortune(signIndex) {
    const dateSeed = getDateSeed();
    const seed = dateSeed * 100 + signIndex;
    const rand = seededRandom(seed);

    // 各運を 1-5 で生成
    const overall = Math.floor(rand() * 5) + 1;
    const love = Math.floor(rand() * 5) + 1;
    const work = Math.floor(rand() * 5) + 1;
    const money = Math.floor(rand() * 5) + 1;

    // ラッキーカラー・ナンバー
    const luckyColor = LUCKY_COLORS[Math.floor(rand() * LUCKY_COLORS.length)];
    const luckyNumber = Math.floor(rand() * 99) + 1;

    // メッセージ
    const message = MESSAGES[Math.floor(rand() * MESSAGES.length)];

    return { overall, love, work, money, luckyColor, luckyNumber, message };
  }

  /**
   * 全星座のランキング（総合運の合計スコアで順位付け）
   */
  function generateRankings() {
    const scores = ZODIAC_SIGNS.map(function (sign, i) {
      const fortune = generateFortune(i);
      // 総合スコア = 全運勢の合計
      const total = fortune.overall + fortune.love + fortune.work + fortune.money;
      return { index: i, total: total };
    });

    // スコア降順でソート
    scores.sort(function (a, b) { return b.total - a.total; });

    // ランキングマップ作成（index -> 順位）
    var rankMap = {};
    scores.forEach(function (item, rank) {
      rankMap[item.index] = rank + 1;
    });
    return rankMap;
  }

  /**
   * 星マーク生成
   */
  function renderStars(count) {
    var html = '<div class="star-rating">';
    for (var i = 0; i < 5; i++) {
      if (i < count) {
        html += '<span class="star-rating__star">&#9733;</span>';
      } else {
        html += '<span class="star-rating__star star-rating__star--empty">&#9733;</span>';
      }
    }
    html += '</div>';
    return html;
  }

  /**
   * 星座グリッドを描画
   */
  function renderZodiacGrid() {
    var grid = document.getElementById('zodiac-grid');
    var html = '';
    ZODIAC_SIGNS.forEach(function (sign, i) {
      html += '<div class="zodiac-card" data-index="' + i + '">';
      html += '  <div class="zodiac-card__symbol">' + sign.symbol + '</div>';
      html += '  <div class="zodiac-card__name">' + sign.name + '</div>';
      html += '  <div class="zodiac-card__date">' + sign.dateRange + '</div>';
      html += '</div>';
    });
    grid.innerHTML = html;

    // クリックイベント
    var cards = grid.querySelectorAll('.zodiac-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        var index = parseInt(this.getAttribute('data-index'), 10);
        selectSign(index);
      });
    });
  }

  /**
   * 今日の日付を表示
   */
  function renderTodayDate() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    var w = weekdays[now.getDay()];
    document.getElementById('today-date').textContent = y + '年' + m + '月' + d + '日（' + w + '）の運勢';
  }

  /**
   * 星座を選択して結果を表示
   */
  function selectSign(index) {
    var sign = ZODIAC_SIGNS[index];
    var fortune = generateFortune(index);
    var rankings = generateRankings();
    var rank = rankings[index];

    // アクティブ状態の更新
    var cards = document.querySelectorAll('.zodiac-card');
    cards.forEach(function (card) {
      card.classList.remove('zodiac-card--active');
    });
    cards[index].classList.add('zodiac-card--active');

    // 結果セクションを表示
    var resultSection = document.getElementById('result-section');
    resultSection.classList.remove('hidden');

    // 結果HTML生成
    var html = '<div class="result" style="animation: fadeIn 0.8s ease;">';

    // ヘッダー
    html += '<div class="result__card-display">';
    html += '  <div class="ranking-badge">' + rank + '位</div>';
    html += '  <div class="result__card-icon">' + sign.symbol + '</div>';
    html += '  <div class="result__card-name">' + sign.name + '</div>';
    html += '  <div class="result__card-name-en">' + sign.nameEn.toUpperCase() + '</div>';
    html += '  <div class="result__card-subtitle">' + sign.dateRange + '　/　' + sign.element + 'のエレメント</div>';
    html += '</div>';

    // 運勢テーブル
    html += '<div class="result__box">';
    html += '  <div class="result__box-title">&#10023; 今日の運勢</div>';

    html += '  <div class="fortune-row">';
    html += '    <span class="fortune-row__label">総合運</span>';
    html += '    ' + renderStars(fortune.overall);
    html += '  </div>';

    html += '  <div class="fortune-row">';
    html += '    <span class="fortune-row__label">恋愛運</span>';
    html += '    ' + renderStars(fortune.love);
    html += '  </div>';

    html += '  <div class="fortune-row">';
    html += '    <span class="fortune-row__label">仕事運</span>';
    html += '    ' + renderStars(fortune.work);
    html += '  </div>';

    html += '  <div class="fortune-row">';
    html += '    <span class="fortune-row__label">金運</span>';
    html += '    ' + renderStars(fortune.money);
    html += '  </div>';

    html += '</div>';

    // ラッキーアイテム
    html += '<div class="result__box">';
    html += '  <div class="result__box-title">&#10023; ラッキーポイント</div>';

    html += '  <div class="fortune-row">';
    html += '    <span class="fortune-row__label">ラッキーカラー</span>';
    html += '    <span style="color: var(--gold-light);">' + fortune.luckyColor + '</span>';
    html += '  </div>';

    html += '  <div class="fortune-row">';
    html += '    <span class="fortune-row__label">ラッキーナンバー</span>';
    html += '    <span style="color: var(--gold-light);">' + fortune.luckyNumber + '</span>';
    html += '  </div>';

    html += '  <div class="fortune-row">';
    html += '    <span class="fortune-row__label">今日のランキング</span>';
    html += '    <span style="color: var(--gold-light);">' + rank + '位 / 12星座中</span>';
    html += '  </div>';

    html += '</div>';

    // メッセージ
    html += '<div class="result__box">';
    html += '  <div class="result__box-title">&#10023; 今日のメッセージ</div>';
    html += '  <p class="result__box-text">' + fortune.message + '</p>';
    html += '</div>';

    // アクション
    html += '<div class="result__actions">';
    html += '  <a href="index.html" class="btn btn--outline-light">他の占いを試す</a>';
    html += '</div>';

    html += '</div>';

    document.getElementById('fortune-result').innerHTML = html;

    // 結果セクションにスクロール
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // 初期化
  renderTodayDate();
  renderZodiacGrid();
})();
