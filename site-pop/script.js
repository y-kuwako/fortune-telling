/**
 * きょうの星占い - Pop-Kawaii Horoscope
 * No external dependencies. Uses date-based seeded randomness.
 */

(function () {
  'use strict';

  // ============================================================
  // Zodiac Data
  // ============================================================

  var zodiacSigns = [
    {
      id: 'aries',
      name: '牡羊座',
      emoji: '\u2648',
      dates: '3/21 - 4/19',
      messages: [
        '今日はあなたの情熱が周囲を明るく照らす日。思い切ったアクションが吉と出そう！新しいことにチャレンジするなら今日がベストタイミング。',
        '直感が冴え渡る一日。ふと思いついたアイデアをメモしておくと、あとで大きなヒントになるかも。午後からは行動力がアップ！',
        'エネルギッシュなあなたに追い風が吹いています。積極的に人と会話することで、思わぬチャンスが舞い込みそう。笑顔を忘れずに。',
        '少しペースダウンして周りを見渡してみて。見落としていた大切なことに気づけるはず。夕方以降にうれしい知らせがありそう。',
        'ワクワクする出来事が待っている予感。好奇心のままに動いてOK。ただし、お財布の紐はちょっとだけ締めておいて。'
      ]
    },
    {
      id: 'taurus',
      name: '牡牛座',
      emoji: '\u2649',
      dates: '4/20 - 5/20',
      messages: [
        '安定感のある一日。コツコツ積み重ねてきたことが実を結ぶ兆し。自分へのご褒美スイーツで気分もアップ！',
        '五感が研ぎ澄まされる日。おいしいものを食べたり、お気に入りの音楽を聴いたりして感性を磨いて。午後から運気上昇。',
        '信頼できる人からの助言に耳を傾けて。あなたの堅実さが周囲から高く評価されています。夜はリラックスタイムを大切に。',
        'お金に関する良いニュースがありそう。ただし衝動買いには注意。本当に必要なものを見極める目が大切な日。',
        'マイペースが一番の武器になる日。焦らずゆっくり進むことで、最高の結果にたどり着けるはず。'
      ]
    },
    {
      id: 'gemini',
      name: '双子座',
      emoji: '\u264A',
      dates: '5/21 - 6/21',
      messages: [
        'コミュニケーション運が絶好調！SNSやメッセージでうれしいやり取りがありそう。情報収集にも最適な日。',
        '好奇心がキラキラ輝く一日。新しい知識やスキルを学ぶと、思わぬところで役に立ちそう。読書もおすすめ。',
        '楽しい会話から素敵なアイデアが生まれる予感。ランチタイムの雑談が意外なきっかけになるかも。',
        '二つの選択肢で迷いそうな日。でも大丈夫、あなたの直感を信じて。どちらを選んでもきっとうまくいく。',
        '言葉の力が強まる日。あなたの一言が誰かの心を軽くするかも。ポジティブな言葉を意識して使ってみて。'
      ]
    },
    {
      id: 'cancer',
      name: '蟹座',
      emoji: '\u264B',
      dates: '6/22 - 7/22',
      messages: [
        '家族や大切な人との絆が深まる日。手料理やちょっとしたプレゼントで気持ちを伝えてみて。温かい時間が過ごせそう。',
        '感受性が豊かになっている今日。映画や音楽で心が揺さぶられるような体験がありそう。感動は成長のチャンス。',
        'あなたの優しさが周囲に伝染する日。困っている人に手を差し伸べると、巡り巡ってあなたにも良いことが。',
        'おうち時間を充実させるとラッキー。模様替えやお掃除で気分もスッキリ。新しいインテリアにも注目して。',
        '直感がさえる一日。なんとなく気になったことには素直に従ってみて。思いがけない幸運につながるかも。'
      ]
    },
    {
      id: 'leo',
      name: '獅子座',
      emoji: '\u264C',
      dates: '7/23 - 8/22',
      messages: [
        'あなたの輝きが最大限に発揮される日！自信を持って堂々と振る舞って。周囲があなたの魅力に引き寄せられそう。',
        'クリエイティブなエネルギーが溢れています。趣味や創作活動に時間を使うと、素晴らしい作品が生まれるかも。',
        '注目を集める場面がありそう。プレゼンや発表の機会があれば、積極的に手を挙げて。あなたの情熱は必ず伝わる。',
        '遊び心を大切にする日。楽しいことに全力投球すると、仕事にも良い影響が。オンとオフのメリハリがカギ。',
        '周囲からの称賛が集まりやすい日。でも調子に乗りすぎず、感謝の気持ちを忘れないで。謙虚さが更なる幸運を呼ぶ。'
      ]
    },
    {
      id: 'virgo',
      name: '乙女座',
      emoji: '\u264D',
      dates: '8/23 - 9/22',
      messages: [
        '細部への気配りが光る日。丁寧な仕事ぶりが評価されそう。健康面では野菜たっぷりのメニューがおすすめ。',
        '整理整頓がラッキーアクション。デスク周りやスマホの中身を片付けると、気持ちもスッキリ。新たな発見も。',
        '分析力が冴える一日。複雑な問題もあなたなら解きほぐせるはず。周囲からの相談事にも的確なアドバイスができそう。',
        'セルフケアに最適な日。スキンケアやストレッチなど、自分を大切にする時間を意識的に作って。',
        '計画的に動くことで効率がグンとアップ。ToDoリストを作成すると、一日の充実度が変わるはず。'
      ]
    },
    {
      id: 'libra',
      name: '天秤座',
      emoji: '\u264E',
      dates: '9/23 - 10/23',
      messages: [
        'バランス感覚が冴える日。人間関係の調整役として大活躍しそう。美しいものに触れることで運気もアップ。',
        'おしゃれを楽しむと運気上昇。新しいコーデやヘアアレンジで気分転換してみて。周囲からの好感度もアップ。',
        '対人運が好調。初対面の人とも自然に打ち解けられそう。パーティーや交流会への参加が吉。',
        '迷ったときは美しい方を選んで。あなたの審美眼は今日特に冴えています。アート鑑賞もおすすめ。',
        '調和を大切にすることで、周囲との関係がさらに良くなる日。Win-Winの提案ができると最高。'
      ]
    },
    {
      id: 'scorpio',
      name: '蠍座',
      emoji: '\u264F',
      dates: '10/24 - 11/22',
      messages: [
        '洞察力が冴え渡る日。表面に隠された本質を見抜く力があなたにはある。深い話ができる相手との時間を大切に。',
        '集中力が高まっています。一つのことにじっくり取り組むと、驚くほどの成果が出そう。没頭する楽しさを味わって。',
        'ミステリアスな魅力が増す日。あなたの奥深さに惹かれる人が現れるかも。秘密は上手に守って。',
        '変化を恐れないで。古いものを手放すと、新しい素敵なものが入ってくるスペースができます。断捨離がおすすめ。',
        '情熱の炎が静かに燃える日。目標に向かってコツコツ進む姿勢が、大きな成功につながっていきそう。'
      ]
    },
    {
      id: 'sagittarius',
      name: '射手座',
      emoji: '\u2650',
      dates: '11/23 - 12/21',
      messages: [
        '冒険心がくすぐられる一日。いつもと違うルートで帰ったり、新しいお店を開拓したり。小さな冒険が大きな発見に。',
        '楽観的なエネルギーに満ちた日。ポジティブな姿勢が周囲にも伝染して、チーム全体の雰囲気が明るくなりそう。',
        '学びの運が高まっています。気になるセミナーやワークショップがあれば迷わず参加して。視野がグッと広がるはず。',
        '自由に発想することで道が開ける日。型にはまらないアイデアが高く評価されそう。遠慮せず提案してみて。',
        '旅行の計画を立てるのに最適な日。行きたい場所をリストアップするだけでもワクワクが止まらないはず。'
      ]
    },
    {
      id: 'capricorn',
      name: '山羊座',
      emoji: '\u2651',
      dates: '12/22 - 1/19',
      messages: [
        '努力が報われる日。これまで頑張ってきたことが認められるチャンスが巡ってきそう。自信を持って前に進んで。',
        '計画性が功を奏する一日。しっかりとしたスケジュール管理で、効率よく物事を進められそう。手帳の活用がカギ。',
        '信頼度がさらにアップする日。責任感のある行動が周囲からの評価につながります。リーダーシップを発揮して。',
        '長期的な目標について考えるのに良い日。5年後、10年後のビジョンを描いてみて。具体的なほど実現に近づく。',
        '堅実な判断が幸運を呼ぶ日。派手さはなくても、確実に前進している自分を褒めてあげて。'
      ]
    },
    {
      id: 'aquarius',
      name: '水瓶座',
      emoji: '\u2652',
      dates: '1/20 - 2/18',
      messages: [
        'ユニークな発想が光る日。常識にとらわれない自由なアイデアが周囲を驚かせそう。あなたらしさ全開でいこう！',
        'テクノロジーとの相性が良い日。新しいアプリやガジェットを試してみると、生活がもっと便利になるかも。',
        '友人関係に良い風が吹いています。久しぶりの友達に連絡を取ってみて。懐かしい話で盛り上がれそう。',
        '社会貢献への意識が高まる日。ボランティアや寄付など、自分にできることを考えてみて。小さな一歩が大切。',
        '独自の世界観が評価される日。みんなと同じでなくてOK。あなたの個性こそが最大の武器。'
      ]
    },
    {
      id: 'pisces',
      name: '魚座',
      emoji: '\u2653',
      dates: '2/19 - 3/20',
      messages: [
        '想像力が豊かになる日。クリエイティブな活動に最適。絵を描いたり、日記を書いたり、自分を表現してみて。',
        '共感力が高まっています。周囲の人の気持ちに寄り添えるあなたは、みんなの心の支え。癒しのパワーを発揮して。',
        '直感を信じて行動すると吉。理屈では説明できない「なんとなく」の感覚が、正解に導いてくれそう。',
        'ロマンチックな気分の日。お気に入りのカフェでゆっくり過ごしたり、素敵な本を読んだりして心を潤して。',
        'スピリチュアルな感性が高まる日。瞑想やヨガなど、心を静める時間を作ると、大切なメッセージを受け取れるかも。'
      ]
    }
  ];

  // Lucky colors pool
  var luckyColors = [
    { name: 'コーラルピンク', hex: '#FF6B6B' },
    { name: 'ミントグリーン', hex: '#4ECDC4' },
    { name: 'レモンイエロー', hex: '#FFE66D' },
    { name: 'ラベンダー', hex: '#B39DDB' },
    { name: 'スカイブルー', hex: '#64B5F6' },
    { name: 'ピーチ', hex: '#FFAB91' },
    { name: 'ローズ', hex: '#F48FB1' },
    { name: 'エメラルド', hex: '#66BB6A' },
    { name: 'ゴールド', hex: '#FFD54F' },
    { name: 'アクアマリン', hex: '#4DD0E1' },
    { name: 'サーモンピンク', hex: '#FF8A80' },
    { name: 'パールホワイト', hex: '#F5F5F5' },
    { name: 'チョコレート', hex: '#8D6E63' },
    { name: 'オレンジ', hex: '#FFB74D' },
    { name: 'ネイビー', hex: '#5C6BC0' }
  ];

  // Lucky items pool
  var luckyItems = [
    'マグカップ', 'ハンカチ', '手帳', 'キャンドル', 'チョコレート',
    'ぬいぐるみ', 'イヤホン', 'ポストカード', 'リップクリーム', 'ミント',
    'お花', 'ストール', '紅茶', 'クッキー', 'ステッカー',
    'メモ帳', 'ブレスレット', 'マスキングテープ', '入浴剤', 'ソックス',
    'カメラ', 'スムージー', 'ピアス', '絵はがき', 'ノート'
  ];

  // ============================================================
  // Seeded Random (date-based daily variety)
  // ============================================================

  function dateSeed() {
    var now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  }

  function seededRandom(seed) {
    // Simple mulberry32-inspired PRNG
    var t = (seed + 0x6D2B79F5) | 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function getSeededValue(signIndex, category) {
    var base = dateSeed();
    var seed = base * 13 + signIndex * 7 + category;
    return seededRandom(seed);
  }

  // ============================================================
  // Fortune Generation
  // ============================================================

  function generateFortune(signIndex) {
    var sign = zodiacSigns[signIndex];

    // Ratings 1-5
    var overall = Math.floor(getSeededValue(signIndex, 1) * 5) + 1;
    var love = Math.floor(getSeededValue(signIndex, 2) * 5) + 1;
    var work = Math.floor(getSeededValue(signIndex, 3) * 5) + 1;
    var money = Math.floor(getSeededValue(signIndex, 4) * 5) + 1;

    // Lucky degree 1-5
    var luckyDegree = Math.floor(getSeededValue(signIndex, 5) * 5) + 1;

    // Message
    var msgIndex = Math.floor(getSeededValue(signIndex, 6) * sign.messages.length);
    var message = sign.messages[msgIndex];

    // Lucky color
    var colorIndex = Math.floor(getSeededValue(signIndex, 7) * luckyColors.length);
    var color = luckyColors[colorIndex];

    // Lucky item
    var itemIndex = Math.floor(getSeededValue(signIndex, 8) * luckyItems.length);
    var item = luckyItems[itemIndex];

    return {
      sign: sign,
      overall: overall,
      love: love,
      work: work,
      money: money,
      luckyDegree: luckyDegree,
      message: message,
      luckyColor: color,
      luckyItem: item
    };
  }

  // ============================================================
  // Star & Heart Rendering
  // ============================================================

  function renderStars(count, max) {
    var html = '';
    for (var i = 0; i < max; i++) {
      if (i < count) {
        html += '<span>\u2605</span>';
      } else {
        html += '<span class="star-empty">\u2605</span>';
      }
    }
    return html;
  }

  function renderHearts(count, max) {
    var html = '';
    for (var i = 0; i < max; i++) {
      if (i < count) {
        html += '<span class="heart-full">\u2665</span>';
      } else {
        html += '<span class="heart-empty">\u2665</span>';
      }
    }
    return html;
  }

  // ============================================================
  // DOM References
  // ============================================================

  var gridEl = document.getElementById('zodiacGrid');
  var resultPanel = document.getElementById('resultPanel');
  var btnRetry = document.getElementById('btnRetry');

  // ============================================================
  // Build Zodiac Grid
  // ============================================================

  function buildGrid() {
    var fragment = document.createDocumentFragment();

    zodiacSigns.forEach(function (sign, index) {
      var card = document.createElement('div');
      card.className = 'zodiac-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', sign.name + 'の占いを見る');
      card.innerHTML =
        '<span class="zodiac-icon">' + sign.emoji + '</span>' +
        '<p class="zodiac-name">' + sign.name + '</p>' +
        '<p class="zodiac-dates">' + sign.dates + '</p>';

      card.addEventListener('click', function () {
        showResult(index);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showResult(index);
        }
      });

      fragment.appendChild(card);
    });

    gridEl.appendChild(fragment);
  }

  // ============================================================
  // Show / Hide Result
  // ============================================================

  function showResult(signIndex) {
    var fortune = generateFortune(signIndex);

    document.getElementById('resultEmoji').textContent = fortune.sign.emoji;
    document.getElementById('resultSignName').textContent = fortune.sign.name;
    document.getElementById('resultDateRange').textContent = fortune.sign.dates;
    document.getElementById('resultOverallStars').innerHTML = renderStars(fortune.overall, 5);
    document.getElementById('resultMessage').textContent = fortune.message;
    document.getElementById('resultLoveStars').innerHTML = renderStars(fortune.love, 5);
    document.getElementById('resultWorkStars').innerHTML = renderStars(fortune.work, 5);
    document.getElementById('resultMoneyStars').innerHTML = renderStars(fortune.money, 5);

    document.getElementById('luckyColorCircle').style.backgroundColor = fortune.luckyColor.hex;
    document.getElementById('luckyColorName').textContent = fortune.luckyColor.name;
    document.getElementById('luckyItem').textContent = fortune.luckyItem;
    document.getElementById('luckyHearts').innerHTML = renderHearts(fortune.luckyDegree, 5);

    // Hide grid, show result
    gridEl.classList.add('hidden');
    resultPanel.classList.remove('active');
    // Force reflow for animation restart
    void resultPanel.offsetWidth;
    resultPanel.classList.add('active');

    // Scroll to top of result
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function hideResult() {
    resultPanel.classList.remove('active');
    gridEl.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================================================
  // Event Listeners
  // ============================================================

  btnRetry.addEventListener('click', hideResult);

  // ============================================================
  // Initialize
  // ============================================================

  buildGrid();

})();
