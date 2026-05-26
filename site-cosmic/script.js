(function () {
  'use strict';

  // --- Data ---

  var signs = [
    { ja: '牡羊座', en: 'ARIES',       period: '03.21 — 04.19', glyph: '♈' },
    { ja: '牡牛座', en: 'TAURUS',      period: '04.20 — 05.20', glyph: '♉' },
    { ja: '双子座', en: 'GEMINI',      period: '05.21 — 06.21', glyph: '♊' },
    { ja: '蟹座',   en: 'CANCER',      period: '06.22 — 07.22', glyph: '♋' },
    { ja: '獅子座', en: 'LEO',         period: '07.23 — 08.22', glyph: '♌' },
    { ja: '乙女座', en: 'VIRGO',       period: '08.23 — 09.22', glyph: '♍' },
    { ja: '天秤座', en: 'LIBRA',       period: '09.23 — 10.23', glyph: '♎' },
    { ja: '蠍座',   en: 'SCORPIO',     period: '10.24 — 11.22', glyph: '♏' },
    { ja: '射手座', en: 'SAGITTARIUS', period: '11.23 — 12.21', glyph: '♐' },
    { ja: '山羊座', en: 'CAPRICORN',   period: '12.22 — 01.19', glyph: '♑' },
    { ja: '水瓶座', en: 'AQUARIUS',    period: '01.20 — 02.18', glyph: '♒' },
    { ja: '魚座',   en: 'PISCES',      period: '02.19 — 03.20', glyph: '♓' }
  ];

  var keywordPool = [
    ['DRIVE', 'IGNITE', 'SPARK', 'PIONEER', 'BOLD', 'RUSH', 'CHARGE', 'BLAZE', 'FOCUS', 'CONQUER'],
    ['ANCHOR', 'BLOOM', 'SAVOR', 'STABLE', 'ROOTED', 'CRAFT', 'SOLID', 'HARVEST', 'PATIENCE', 'DEPTH'],
    ['SIGNAL', 'WIRE', 'LINK', 'CURIOUS', 'AGILE', 'SHIFT', 'ECHO', 'PULSE', 'CONNECT', 'SCAN'],
    ['NEST', 'TIDE', 'EMBRACE', 'MEMORY', 'SHELTER', 'GLOW', 'TENDER', 'INTUITION', 'HOME', 'CRADLE'],
    ['SHINE', 'ROAR', 'CROWN', 'CREATE', 'RADIATE', 'LEAD', 'PROUD', 'FIRE', 'PRESENCE', 'COURAGE'],
    ['REFINE', 'TUNE', 'DETAIL', 'CLARIFY', 'HEAL', 'PRECISE', 'ORDER', 'CRAFT', 'SERVE', 'POLISH'],
    ['BALANCE', 'GRACE', 'MIRROR', 'CHOOSE', 'HARMONY', 'POISE', 'PAIR', 'AESTHETIC', 'TUNE', 'FAIR'],
    ['DIVE', 'REVEAL', 'TRANSFORM', 'INTENSE', 'PHOENIX', 'PURGE', 'TRUTH', 'CORE', 'RESET', 'MAGNETIC'],
    ['LAUNCH', 'EXPAND', 'QUEST', 'WANDER', 'OPTIMISM', 'AIM', 'BOUNDLESS', 'VISION', 'JOURNEY', 'FAITH'],
    ['CLIMB', 'BUILD', 'STRUCTURE', 'PATIENT', 'MASTER', 'GOAL', 'STRATEGIC', 'ENDURE', 'STEADY', 'LEGACY'],
    ['UPLINK', 'FUTURE', 'INNOVATE', 'TRIBE', 'REWIRE', 'BREAK', 'GLITCH', 'UNIQUE', 'SIGNAL', 'BEYOND'],
    ['FLOW', 'DREAM', 'EMPATH', 'MIST', 'MERGE', 'COMPASSION', 'PSYCHIC', 'TIDE', 'BLUR', 'OCEANIC']
  ];

  var messages = [
    [
      '宇宙が前進のサインを発している。迷う前に行動した者だけが、新しい軌道に乗れる。',
      '抑えてきた衝動を解き放つタイミング。最初の一歩はあなたが想像するより小さくていい。',
      '直感のシグナルが強い一日。ノイズを切り、自分の周波数だけに集中して。',
      '誰かの後ろを歩く必要はない。あなたのスピードで星々が応援している。',
      '小さな勝利を可視化することで、より大きなエネルギーが回ってくる。'
    ],
    [
      '安定軌道に乗っている。焦って加速せず、今ある資源を丁寧に磨くこと。',
      '五感を起動するモード。良い香り、心地よい音、温かい食事が運勢を底上げする。',
      '土台を見直すと、来週以降の展開がクリアに見える日。',
      '本物の価値を見抜く目が冴えている。安易な選択肢には乗らないで。',
      '身近な人とゆっくり過ごす時間が、最高の充電になる。'
    ],
    [
      '情報の宇宙線が降り注ぐ日。複数の選択肢から、最も「面白そう」を選んで。',
      '言葉のチューニングを意識すると、伝達精度が劇的に上がる。',
      '出会いがリンクを生む。普段話さない相手にこそ、新しい扉がある。',
      '考えすぎは思考のオーバーヒート。動きながら整える方が早い。',
      '小さなアウトプットを今日中に一つ。それが明日への運の種になる。'
    ],
    [
      '感情の波を敵視しないで。それはあなたのレーダーで、未来を先読みしている。',
      '安心できる場所に戻ることが、最大の戦略。無理に明るくしなくていい。',
      '大切な人にひとこと感謝を伝えると、宇宙が倍にして返してくれる。',
      '過去の記憶が今日の判断を助ける。直感は信頼に足る。',
      '空間を整えれば、心の信号も整う。机の上から始めてみて。'
    ],
    [
      '銀河の中心にいるような輝きを持つ一日。堂々と表現してOK。',
      '注目が集まる。あなたの言葉一つで、誰かのモードが切り替わる。',
      '創造のエネルギーが最大出力。形にすることを恐れないで。',
      '楽しむことが最強の戦略。義務感では空回りする日。',
      'リーダーとしての立ち位置が試される。判断は迷わず、責任は軽やかに。'
    ],
    [
      '解像度を上げると突破口が見える。ディテールにこそ未来がある。',
      '健康システムのアップデート日。小さな習慣の見直しが効く。',
      '完璧主義は一旦オフ。80%で世に出す方が、結果として品質が上がる。',
      '誰かの役に立つことで、自分の存在価値が再起動される。',
      '情報の整理整頓。雑然とした頭の中にこそ、解決のヒントが埋もれている。'
    ],
    [
      'バランスのセンサーが鋭敏な日。傾きを早めに察知して。',
      '美しいものに触れることが、今日のチャージ方法。',
      '人と人の間に立つ役割を引き受けると、評価が静かに積み上がる。',
      '迷ったら、より多くの人が穏やかになる選択を。',
      '見た目を整えることが、内面の周波数も整える効果を持つ日。'
    ],
    [
      '表層をスキャンするだけでは足りない。もう一段深く潜る勇気を。',
      '手放した瞬間、新しい何かが入ってくるタイミング。',
      '集中力が極まる日。一点突破型の作業に向いている。',
      '秘密を守ることで、信頼の磁場が強まる。',
      '変容を恐れないで。脱皮の痛みは、次のあなたへの通行料。'
    ],
    [
      '行動半径を広げると、運の確率が跳ね上がる。いつもと違うルートを試して。',
      '学びへの欲求が宇宙レベル。新ジャンルの本に手を伸ばして。',
      '楽観のエネルギーが周囲を巻き込む。あなたの笑顔が連鎖を生む日。',
      '大きなビジョンを描くと、日常の選択基準も変わってくる。',
      '異文化との接触が視野を一気に拡張する。海外コンテンツがおすすめ。'
    ],
    [
      '地道な構築が報われる兆し。焦らず、積み上げに集中を。',
      '計画のリビルドに最適。現実的な目標設定が成功の鍵を握る。',
      '責任ある立ち振る舞いが評価される。信頼は静かに、確実に積まれている。',
      '無駄を削ぎ落とすと、本当に重要なものが浮かび上がる。',
      '経験者の言葉に耳を澄まして。そこに最短ルートのヒントがある。'
    ],
    [
      '常識のフレームを超える発想が、突破口になる。自由に思考していい。',
      '仲間とのコラボが力を生む。一人で抱え込まないこと。',
      '未来のビジョンを言語化するのに最適な日。書き出してみて。',
      '新しいテクノロジーやツールを試すと、効率が大幅にアップする。',
      '少数派であることを誇って。あなたの独自視点こそが価値だ。'
    ],
    [
      '直感のセンサーが極限まで研ぎ澄まされている。論理を超えた「感じ」を信じて。',
      '一人で過ごす静かな時間が、創造の源になる。',
      '人の感情に敏感になれる日。さりげない優しさが大きな波紋を生む。',
      '芸術や音楽に触れると、言葉にできなかった感情が整理される。',
      '流れに身を任せる勇気。コントロールを手放した先に、思いがけない展開が待っている。'
    ]
  ];

  var luckyColors = [
    { name: 'NEON CORAL',   hex: '#ff6b6b' },
    { name: 'EMERALD',      hex: '#00d4a0' },
    { name: 'ELECTRIC BLUE',hex: '#00aaff' },
    { name: 'PEARL WHITE',  hex: '#e8e8ff' },
    { name: 'SOLAR GOLD',   hex: '#ffd700' },
    { name: 'JADE GREEN',   hex: '#7fffa0' },
    { name: 'ROSE QUARTZ',  hex: '#ffb0d4' },
    { name: 'CRIMSON RED',  hex: '#ff2e5c' },
    { name: 'COSMIC PURPLE',hex: '#9d4dff' },
    { name: 'MIDNIGHT NAVY',hex: '#4a4aff' },
    { name: 'CYBER MINT',   hex: '#00ffcc' },
    { name: 'AURORA PINK',  hex: '#ff66cc' }
  ];

  var luckyItems = [
    'ワイヤレスイヤホン', 'クリスタル', 'ホログラム文具', 'ミントタブレット',
    'シルバーアクセサリー', 'モバイルバッテリー', '香水アトマイザー', 'メタリック小物',
    'インセンス', '万年筆', 'スマートウォッチ', 'パワーストーン',
    'ガラスのコップ', 'ノイズキャンセリングヘッドホン', 'ミニ観葉植物', 'リップバーム',
    'デジタル時計', 'お守り', 'ピアス', 'シルクスカーフ'
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
    return y + '.' + m + '.' + d;
  }

  function lunarPhaseLabel() {
    var phases = ['NEW', 'WAXING', 'FIRST QTR', 'WAXING GIBBOUS', 'FULL', 'WANING GIBBOUS', 'LAST QTR', 'WANING'];
    var now = new Date();
    var ref = new Date(2000, 0, 6); // known new moon
    var days = (now - ref) / 86400000;
    var phase = (days % 29.53) / 29.53;
    var idx = Math.floor(phase * 8) % 8;
    return phases[idx];
  }

  function cosmicVibeLabel(seed) {
    var vibes = ['SERENE', 'ELECTRIC', 'INTENSE', 'FLOWING', 'BOLD', 'COSMIC', 'DREAMY', 'SHARP'];
    return vibes[Math.floor(seededRandom(seed + 999) * vibes.length)];
  }

  function starsString(count) {
    var filled = '';
    var empty = '';
    for (var i = 0; i < count; i++) filled += '★';
    for (var j = count; j < 5; j++) empty += '☆';
    return filled + empty;
  }

  function energyReadout(value) {
    var total = 20;
    var filled = Math.round((value / 100) * total);
    var s = '';
    for (var i = 0; i < total; i++) {
      s += (i < filled) ? '■' : '□';
    }
    return s;
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
    while (k2 === k1) k2 = (k2 + 1) % pool.length;
    while (k3 === k1 || k3 === k2) k3 = (k3 + 1) % pool.length;

    var msgPool = messages[signIndex];
    var msgIndex = Math.floor(seededRandom(base + 7) * msgPool.length);

    var color = luckyColors[Math.floor(seededRandom(base + 8) * luckyColors.length)];
    var item = luckyItems[Math.floor(seededRandom(base + 9) * luckyItems.length)];
    var num = Math.floor(seededRandom(base + 10) * 99) + 1;

    return {
      energy: energy,
      love: love,
      work: work,
      money: money,
      keywords: [pool[k1], pool[k2], pool[k3]],
      message: msgPool[msgIndex],
      luckyColor: color,
      luckyNumber: num,
      luckyItem: item
    };
  }

  // --- DOM ---

  var selectionView = document.getElementById('selectionView');
  var resultView = document.getElementById('resultView');
  var dateEl = document.getElementById('currentDate');
  var lunarEl = document.getElementById('lunarPhase');
  var vibeEl = document.getElementById('cosmicVibe');
  var backLink = document.getElementById('backLink');
  var signButtons = document.querySelectorAll('.sign');

  dateEl.textContent = formatDate();
  lunarEl.textContent = lunarPhaseLabel();
  vibeEl.textContent = cosmicVibeLabel(dateSeed());

  function showResult(index) {
    var sign = signs[index];
    var fortune = generateFortune(index);

    document.getElementById('resultGlyph').textContent = sign.glyph;
    document.getElementById('resultName').textContent = sign.ja;
    document.getElementById('resultEn').textContent = sign.en;
    document.getElementById('resultPeriod').textContent = sign.period;
    document.getElementById('energyNumber').textContent = fortune.energy;
    document.getElementById('energyReadout').textContent = energyReadout(fortune.energy);
    document.getElementById('starsLove').textContent = starsString(fortune.love);
    document.getElementById('starsWork').textContent = starsString(fortune.work);
    document.getElementById('starsMoney').textContent = starsString(fortune.money);

    // Keywords as pills
    var kwContainer = document.getElementById('keywords');
    kwContainer.innerHTML = '';
    fortune.keywords.forEach(function (kw) {
      var span = document.createElement('span');
      span.className = 'keyword';
      span.textContent = '# ' + kw;
      kwContainer.appendChild(span);
    });

    document.getElementById('fortuneMessage').textContent = fortune.message;

    // Lucky data
    document.getElementById('luckyColor').textContent = fortune.luckyColor.name;
    var swatch = document.getElementById('luckySwatch');
    swatch.style.background = fortune.luckyColor.hex;
    swatch.style.boxShadow = '0 0 14px ' + fortune.luckyColor.hex;
    document.getElementById('luckyNumber').textContent = fortune.luckyNumber;
    document.getElementById('luckyItem').textContent = fortune.luckyItem;

    // Fade transition
    selectionView.classList.add('fade-out');
    setTimeout(function () {
      selectionView.classList.add('hidden');
      selectionView.classList.remove('fade-out');
      resultView.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Animate bars after view shows
      requestAnimationFrame(function () {
        setTimeout(function () {
          document.getElementById('energyBar').style.width = fortune.energy + '%';
          document.querySelectorAll('.metric__fill').forEach(function (bar) {
            var key = bar.dataset.key;
            bar.style.width = (fortune[key] * 20) + '%';
          });
        }, 80);
      });
    }, 220);
  }

  function showSelection() {
    resultView.classList.add('fade-out');
    setTimeout(function () {
      resultView.classList.add('hidden');
      resultView.classList.remove('fade-out');
      // Reset bars
      document.getElementById('energyBar').style.width = '0';
      document.querySelectorAll('.metric__fill').forEach(function (bar) {
        bar.style.width = '0';
      });
      signButtons.forEach(function (btn) { btn.classList.remove('active'); });
      selectionView.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 220);
  }

  signButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      signButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      setTimeout(function () {
        showResult(parseInt(btn.dataset.index, 10));
      }, 200);
    });
  });

  backLink.addEventListener('click', function (e) {
    e.preventDefault();
    showSelection();
  });

})();
