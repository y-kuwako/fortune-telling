(function () {
  'use strict';

  // --- Data ---

  var signs = [
    { ja: '牡羊座', en: 'aries', period: '3/21 - 4/19' },
    { ja: '牡牛座', en: 'taurus', period: '4/20 - 5/20' },
    { ja: '双子座', en: 'gemini', period: '5/21 - 6/21' },
    { ja: '蟹座', en: 'cancer', period: '6/22 - 7/22' },
    { ja: '獅子座', en: 'leo', period: '7/23 - 8/22' },
    { ja: '乙女座', en: 'virgo', period: '8/23 - 9/22' },
    { ja: '天秤座', en: 'libra', period: '9/23 - 10/23' },
    { ja: '蠍座', en: 'scorpio', period: '10/24 - 11/22' },
    { ja: '射手座', en: 'sagittarius', period: '11/23 - 12/21' },
    { ja: '山羊座', en: 'capricorn', period: '12/22 - 1/19' },
    { ja: '水瓶座', en: 'aquarius', period: '1/20 - 2/18' },
    { ja: '魚座', en: 'pisces', period: '2/19 - 3/20' }
  ];

  var keywordPool = [
    ['直感', '決断', '前進', '出会い', '挑戦', '集中', '余白', '信頼', '発見', '静寂'],
    ['安定', '忍耐', '豊かさ', '感謝', '休息', '本質', '継続', '調和', '実り', '根気'],
    ['対話', '好奇心', '変化', '柔軟', '共有', '学び', '言葉', '閃き', '交流', '適応'],
    ['内省', '家族', '安心', '記憶', '優しさ', '守護', '感受性', '浄化', '原点', '潤い'],
    ['自信', '表現', '情熱', '創造', '輝き', '主導', '解放', '誇り', '熱量', '存在感'],
    ['整理', '分析', '改善', '丁寧', '健康', '観察', '精度', '計画', '配慮', '秩序'],
    ['均衡', '美意識', '協力', '公正', '洗練', '選択', '品格', '関係', '調整', '優雅'],
    ['深層', '変容', '真実', '覚悟', '再生', '洞察', '核心', '手放す', '集約', '本能'],
    ['冒険', '自由', '拡大', '楽観', '哲学', '旅立ち', '成長', '視野', '挑む', '解放感'],
    ['責任', '構築', '達成', '努力', '堅実', '目標', '基盤', '忍耐力', '戦略', '規律'],
    ['革新', '独創', '未来', '連帯', '理想', '突破', '個性', '実験', '先見', '自由度'],
    ['共感', '癒し', '想像力', '受容', '直感力', '夢', '慈悲', '流れ', '感性', '浸透']
  ];

  var messages = [
    [
      '新しいことを始めるには最適な一日。迷う前に動くことで道が開ける。',
      '周囲のペースに合わせる必要はない。自分のリズムで進めば、自然と結果がついてくる。',
      'ふとした思いつきに価値がある。メモを取る習慣が未来の自分を助ける。',
      '体を動かすことで頭が冴える日。朝の散歩が一日の質を変える。',
      '言葉より行動が伝わる日。黙って実行する姿勢が信頼を生む。'
    ],
    [
      '急がなくていい。今日は地に足をつけて、一つずつ確実に進めること。',
      '五感を大切にする日。美味しいものを食べ、心地よい音楽を聴くこと。',
      '物事の価値を見極める力が冴えている。衝動的な判断は避けて。',
      '身近な人との時間が心を満たす。特別なことは必要ない。',
      '長期的な視点で考えると、今日の小さな努力が大きな差になる。'
    ],
    [
      '情報が集まりやすい日。ただし、すべてを鵜呑みにせず、自分で確かめること。',
      'コミュニケーションが鍵になる。言葉選びを丁寧にするだけで結果が変わる。',
      '二つの選択肢で迷ったら、より面白いほうを選ぶこと。',
      '新しい人との出会いが視野を広げる。いつもと違う場所に行ってみて。',
      '考えすぎて動けなくなる前に、まず小さな一歩を踏み出すこと。'
    ],
    [
      '自分の気持ちに正直になる日。無理に明るく振る舞う必要はない。',
      '家で過ごす時間が充実する。環境を整えることで心も整う。',
      '過去の経験が今日の判断を助ける。直感を信じて大丈夫。',
      '大切な人に感謝を伝えるのに最適な日。シンプルな言葉でいい。',
      '感情の波を否定しないこと。感じることが次の行動への燃料になる。'
    ],
    [
      '自分を表現することに躊躇しないで。あなたの意見には価値がある。',
      '注目を集めやすい日。その影響力を良い方向に使うことを意識して。',
      '楽しむことが最優先。義務感で動くと空回りする。',
      'リーダーシップを発揮する場面がある。自信を持って判断を。',
      '創造的なエネルギーが高まっている。形にすることを恐れないで。'
    ],
    [
      '細部に気を配ることで全体の質が上がる日。丁寧さが武器になる。',
      '健康面に意識を向けるタイミング。小さな習慣の見直しが効果的。',
      '完璧を求めすぎず、80点で進める勇気も必要。',
      '誰かの役に立つことで自分の価値を実感できる日。',
      '情報の整理をすると、見えていなかった解決策が浮かび上がる。'
    ],
    [
      'バランスを取ることが大切な日。片方に偏りすぎていないか確認を。',
      '人間関係の調整役として力を発揮できる。冷静な判断が求められる。',
      '美しいものに触れることで感性が磨かれる。美術館や本屋に足を運んで。',
      '迷ったときは、より多くの人が幸せになる選択を。',
      '外見を整えることで内面にも良い影響がある日。身だしなみを意識して。'
    ],
    [
      '表面的な答えに満足しないこと。もう一段深く掘り下げると真実が見える。',
      '手放すことで新しいものが入ってくる。執着を見直すタイミング。',
      '集中力が高まる日。一つのことに没頭すると大きな成果が出る。',
      '秘密を守ることで信頼が深まる。口は堅く、心は広く。',
      '変化を恐れない姿勢が周囲にも良い影響を与える。'
    ],
    [
      '行動範囲を広げると幸運に出会える。いつもと違うルートを試して。',
      '学びへの意欲が高まる日。新しい分野の本を手に取ってみて。',
      '楽観的な姿勢が周囲を明るくする。笑顔の連鎖を生み出せる日。',
      '大きな目標を掲げることで日常の行動が変わる。',
      '異文化や新しい価値観に触れることで視野が一気に広がる。'
    ],
    [
      '地道な努力が報われる兆し。焦らず、今やるべきことに集中を。',
      '計画を立て直すのに良い日。現実的な目標設定が成功の鍵。',
      '責任ある行動が評価される。信頼の積み重ねが未来を作る。',
      '無駄を省くことで本当に大切なものが見えてくる。',
      '先輩や経験者の言葉に耳を傾けること。そこにヒントがある。'
    ],
    [
      '常識にとらわれない発想が突破口になる。自由に考えることを許して。',
      '仲間との連携が力になる日。一人で抱え込まないこと。',
      '未来のビジョンを描くのに最適な日。理想を言語化してみて。',
      'テクノロジーや新しいツールを試すと効率が大幅に上がる。',
      '少数派であることを恐れないで。独自の視点に価値がある。'
    ],
    [
      '直感が冴える日。論理では説明できない「感じ」を大切に。',
      '一人の時間が創造性を高める。静かな場所で自分と向き合って。',
      '人の気持ちに敏感になれる日。さりげない優しさが大きな力になる。',
      '芸術や音楽に触れることで、言葉にできない感情が整理される。',
      '流れに身を任せることで、予想外の良い展開が待っている。'
    ]
  ];

  // --- Utility ---

  function dateSeed() {
    var now = new Date();
    return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  }

  function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function formatDate() {
    var now = new Date();
    var y = now.getFullYear();
    var m = String(now.getMonth() + 1).padStart(2, '0');
    var d = String(now.getDate()).padStart(2, '0');
    var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var day = days[now.getDay()];
    return y + '.' + m + '.' + d + ' (' + day + ')';
  }

  function starsString(count) {
    var filled = '';
    var empty = '';
    for (var i = 0; i < count; i++) filled += '\u2605';
    for (var j = count; j < 5; j++) empty += '\u2606';
    return filled + empty;
  }

  // --- Fortune Generation ---

  function generateFortune(signIndex) {
    var seed = dateSeed();
    var base = seed + signIndex * 7;

    var energy = Math.floor(seededRandom(base) * 41) + 55; // 55-95
    var love = Math.floor(seededRandom(base + 1) * 5) + 1;
    var work = Math.floor(seededRandom(base + 2) * 5) + 1;
    var money = Math.floor(seededRandom(base + 3) * 5) + 1;

    var pool = keywordPool[signIndex];
    var k1 = Math.floor(seededRandom(base + 4) * pool.length);
    var k2 = Math.floor(seededRandom(base + 5) * pool.length);
    var k3 = Math.floor(seededRandom(base + 6) * pool.length);
    // Avoid duplicates
    while (k2 === k1) k2 = (k2 + 1) % pool.length;
    while (k3 === k1 || k3 === k2) k3 = (k3 + 1) % pool.length;

    var msgPool = messages[signIndex];
    var msgIndex = Math.floor(seededRandom(base + 7) * msgPool.length);

    return {
      energy: energy,
      love: love,
      work: work,
      money: money,
      keywords: [pool[k1], pool[k2], pool[k3]],
      message: msgPool[msgIndex]
    };
  }

  // --- DOM ---

  var selectionView = document.getElementById('selectionView');
  var resultView = document.getElementById('resultView');
  var dateEl = document.getElementById('currentDate');
  var backLink = document.getElementById('backLink');
  var signButtons = document.querySelectorAll('.sign');

  dateEl.textContent = formatDate();

  function showResult(index) {
    var sign = signs[index];
    var fortune = generateFortune(index);

    document.getElementById('resultName').textContent = sign.ja;
    document.getElementById('resultEn').textContent = sign.en;
    document.getElementById('resultPeriod').textContent = sign.period;
    document.getElementById('energyNumber').textContent = fortune.energy;
    document.getElementById('starsLove').textContent = starsString(fortune.love);
    document.getElementById('starsWork').textContent = starsString(fortune.work);
    document.getElementById('starsMoney').textContent = starsString(fortune.money);
    document.getElementById('keywords').textContent = fortune.keywords.join(' / ');
    document.getElementById('fortuneMessage').textContent = fortune.message;

    // Fade transition
    selectionView.classList.add('fade-out');
    setTimeout(function () {
      selectionView.classList.add('hidden');
      selectionView.classList.remove('fade-out');
      resultView.classList.remove('hidden');
    }, 200);
  }

  function showSelection() {
    resultView.classList.add('fade-out');
    setTimeout(function () {
      resultView.classList.add('hidden');
      resultView.classList.remove('fade-out');
      signButtons.forEach(function (btn) { btn.classList.remove('active'); });
      selectionView.classList.remove('hidden');
    }, 200);
  }

  signButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      signButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      setTimeout(function () {
        showResult(parseInt(btn.dataset.index, 10));
      }, 150);
    });
  });

  backLink.addEventListener('click', function (e) {
    e.preventDefault();
    showSelection();
  });

})();
