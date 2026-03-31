/* ========================================
   和風占い処 - Traditional Japanese Fortune
   ======================================== */

// ── おみくじデータ ──

const fortuneLevels = [
  { level: '大吉', weight: 10 },
  { level: '吉',   weight: 20 },
  { level: '中吉', weight: 20 },
  { level: '小吉', weight: 15 },
  { level: '末吉', weight: 15 },
  { level: '凶',   weight: 10 },
  { level: '大凶', weight: 10 }
];

const wakaPoems = {
  '大吉': [
    '春風に\n花咲き誇る\n山の道\n行く先々に\n幸ぞ満つらむ',
    '朝日さす\n峰の高嶺に\n立つ鶴の\n千代を寿ぎて\n舞ひ遊ぶかな',
    '満ち潮の\n如く運気は\n高まりて\n望む事ども\n叶はぬはなし'
  ],
  '吉': [
    '穏やかに\n流るる水の\n如くにて\n心安らぐ\n日々ぞ続かむ',
    '秋の田の\n実り豊かに\n稲穂垂れ\n努めし甲斐の\nありとこそ知れ',
    '雲晴れて\n月の光の\n冴え渡る\n如き幸ひの\n訪れむとす'
  ],
  '中吉': [
    '道半ば\n霧立ちこむる\n山路にも\nやがて晴れ間の\n見ゆる時あり',
    '松の葉の\n色変はらぬが\n如くにて\n堅き志\n貫くべし',
    '水底の\n石の如くに\n動ぜずば\nやがて清きに\n映る月影'
  ],
  '小吉': [
    'ひと雨の\n過ぎし後にぞ\n虹は立つ\n耐へ忍びてぞ\n光を見むか',
    '小さき芽の\nやがて大樹と\nなる如く\n焦らず歩めば\n道は開けむ',
    '夕暮れの\n空に一筋\n光あり\n望みを捨てず\n進むべき道'
  ],
  '末吉': [
    '冬枯れの\n野にも春待つ\n草の芽の\n力を信じて\n時を待つべし',
    '暗き夜も\nやがて明くると\n知りぬれば\n今しばし耐へて\n光を待たむ',
    '遅くとも\n咲かぬ花なし\n梅の如く\n時至らば\n香り放たむ'
  ],
  '凶': [
    '荒波の\n立つ海原は\n避けて行け\n静かなる入江\n探し求めよ',
    '霧深き\n山路に迷ふ\n旅人よ\n足元見つめて\n一歩づつ行け',
    '風強き\n日には外出\n控へつつ\n内なる力を\n養ふべし時'
  ],
  '大凶': [
    '嵐去る\n後にこそ見ゆれ\n青き空\n今は身を伏せ\n時を待つべし',
    '深き谷\n落つることあらば\n登る道\n必ずやあると\n信じて進め',
    '闇の夜に\n灯火を守り\n耐へ忍べ\nやがて暁の\n光差さむに'
  ]
};

const categoryFortunes = {
  '大吉': {
    '願望': '大いに叶ふ。信じて進むべし。',
    '待人': '思はぬ方より吉報あり。もうすぐ来たる。',
    '失物': '速やかに出づ。高き所を探すべし。',
    '旅行': '大吉。遠方なれど安全なり。良き出会ひあり。',
    '商売': '万事順調。新しき事業、始むるに最良の時。',
    '学問': '努力実りて大いに成果あり。精進せよ。',
    '恋愛': '良縁に恵まる。心開きて相手を受け入れよ。'
  },
  '吉': {
    '願望': '叶ふ。されど焦りは禁物なり。',
    '待人': '遅れて来たる。待つ甲斐あり。',
    '失物': '出づ。身近なる所を探すべし。',
    '旅行': '吉。近場より始めよ。',
    '商売': '堅実に進めば利あり。無理はするな。',
    '学問': '日々の積み重ね、やがて大きな実りとなる。',
    '恋愛': '穏やかなる縁あり。急がず育むべし。'
  },
  '中吉': {
    '願望': '半ば叶ふ。辛抱強く待て。',
    '待人': '来たるも遅し。心穏やかに待つべし。',
    '失物': '出づるも時かかる。忍耐肝要。',
    '旅行': '近場なれば吉。無理なる遠出は控へよ。',
    '商売': '小さき利あり。大きなる賭けは避けよ。',
    '学問': '基礎を固むれば道開く。地道に励め。',
    '恋愛': '縁はあれど、時期尚早。じっくり見極めよ。'
  },
  '小吉': {
    '願望': '小さく叶ふ。大望は時を改めよ。',
    '待人': '来たれども期待せぬが吉。',
    '失物': '出づる事難し。されど諦むるな。',
    '旅行': '差し障りなし。されど注意怠るな。',
    '商売': '現状維持が吉。新規は慎重に。',
    '学問': '少しづつ進む。急がば回れの心で。',
    '恋愛': '小さき幸あり。高望みは禁物。'
  },
  '末吉': {
    '願望': '遅れて叶ふ。気長に待て。',
    '待人': '当分来たらず。されどいづれ現る。',
    '失物': '出づるに時かかる。気長に探すべし。',
    '旅行': '延期するが吉。時期を改めよ。',
    '商売': '今は動くな。機を待つべし。',
    '学問': '苦しき時なれど、やがて光明あり。',
    '恋愛': '焦りは禁物。時を待てば良縁あり。'
  },
  '凶': {
    '願望': '叶ひ難し。方向を改むべし。',
    '待人': '来たらず。別の縁を求めよ。',
    '失物': '出でず。執着を捨てよ。',
    '旅行': '控へるが吉。身辺に注意せよ。',
    '商売': '損あり。慎重に事を運べ。',
    '学問': '方法を改めよ。独り善がりは禁物。',
    '恋愛': '今は縁遠し。己を磨く時なり。'
  },
  '大凶': {
    '願望': '叶はず。一度すべてを見直すべし。',
    '待人': '来たらず。当分は一人にて過ごすべし。',
    '失物': '出でず。諦めて心を新たにせよ。',
    '旅行': '慎むべし。家にて静かに過ごせ。',
    '商売': '大いに損あり。新規厳禁。守りに徹せよ。',
    '学問': '根本より見直すべし。基礎に立ち返れ。',
    '恋愛': '今は修行の時。己を見つめ直すべし。'
  }
};

// ── 九星気学データ ──

const kyuseiStars = [
  {
    number: 1,
    name: '一白水星',
    element: 'water',
    elementName: '水',
    fortune: '水の如く柔軟にして、万物を潤す力を持つ。今年は静かに内なる力を蓄へる時なり。人との縁を大切にし、流れに身を任せつつも己の道を見失ふことなかれ。智慧深き判断が幸運を呼び寄す。'
  },
  {
    number: 2,
    name: '二黒土星',
    element: 'earth',
    elementName: '土',
    fortune: '大地の如く万物を支ふる力あり。今年は地道なる努力が実を結ぶ時。焦らず着実に歩みを進めよ。人を助くる事により、己もまた助けらるる。忍耐こそが最大の武器なり。'
  },
  {
    number: 3,
    name: '三碧木星',
    element: 'wood',
    elementName: '木',
    fortune: '春の若木の如く、成長の勢ひ盛んなり。新しき事に挑む好機到来。されど根を張ることを忘るるな。勢ひに任せて突き進むより、時に立ち止まりて周りを見渡す事が肝要なり。'
  },
  {
    number: 4,
    name: '四緑木星',
    element: 'wood',
    elementName: '木',
    fortune: '風に揺れる柳の如く、しなやかさこそ力なり。人との交はりに恵まれる年。遠方より良き知らせ届く。信頼を積み重ぬることが大いなる財産となる。穏やかなる心を保て。'
  },
  {
    number: 5,
    name: '五黄土星',
    element: 'earth',
    elementName: '土',
    fortune: '天地の中心に位置する帝王の星。強大なる運気を持つも、その力を正しく用ゐよ。傲慢になることなく、謙虚にして人を導く時。大いなる変革の年、覚悟を持ちて臨むべし。'
  },
  {
    number: 6,
    name: '六白金星',
    element: 'metal',
    elementName: '金',
    fortune: '天の如く高きを目指す志あり。指導者としての資質が輝く年なり。決断力を持ちて事に当たるべし。されど独善に陥ることなく、周囲の声に耳を傾くることが成功への鍵。'
  },
  {
    number: 7,
    name: '七赤金星',
    element: 'metal',
    elementName: '金',
    fortune: '秋の実りの如く、喜びに満つる時。社交運高まり、楽しき集ひ多し。されど浮かれ過ぎは禁物なり。言葉を慎み、散財を控へれば、末永き幸ひを手に入れむ。'
  },
  {
    number: 8,
    name: '八白土星',
    element: 'earth',
    elementName: '土',
    fortune: '山の如く不動にして、変革の力を秘む。古きを改め新しきを興す時なり。過去の経験が今こそ活きる。家族との絆を深め、堅実なる歩みを続くれば大いなる成果を得む。'
  },
  {
    number: 9,
    name: '九紫火星',
    element: 'fire',
    elementName: '火',
    fortune: '炎の如く輝き、万人の目を引く年なり。才能が認められ、名声を得る好機。されど火は一瞬にして燃え尽きることもあり。地道なる努力を怠ることなく、感謝の心を忘るるな。'
  }
];

// ── おみくじ機能 ──

function drawOmikuji() {
  var btn = document.getElementById('drawBtn');
  var box = document.getElementById('omikujiBox');
  var result = document.getElementById('omikujiResult');

  // Disable button during animation
  btn.disabled = true;

  // Shake the box
  box.classList.add('shaking');

  // Hide previous result
  result.classList.remove('visible');
  result.classList.remove('fade-in');

  setTimeout(function() {
    box.classList.remove('shaking');

    // Select fortune based on weighted random
    var level = weightedRandom(fortuneLevels);

    // Display result
    displayOmikujiResult(level);

    // Re-enable button
    btn.disabled = false;
  }, 1000);
}

function weightedRandom(items) {
  var totalWeight = 0;
  for (var i = 0; i < items.length; i++) {
    totalWeight += items[i].weight;
  }
  var random = Math.random() * totalWeight;
  var cumulative = 0;
  for (var i = 0; i < items.length; i++) {
    cumulative += items[i].weight;
    if (random <= cumulative) {
      return items[i].level;
    }
  }
  return items[items.length - 1].level;
}

function displayOmikujiResult(level) {
  var result = document.getElementById('omikujiResult');
  var stamp = document.getElementById('resultStamp');
  var fortuneText = document.getElementById('fortuneLevel');
  var wakaText = document.getElementById('wakaText');
  var categories = document.getElementById('fortuneCategories');

  // Set fortune level
  fortuneText.textContent = level;

  // Set stamp animation
  stamp.classList.remove('stamp-animate');
  void stamp.offsetWidth; // force reflow
  stamp.classList.add('stamp-animate');

  // Select random waka
  var poems = wakaPoems[level];
  var poem = poems[Math.floor(Math.random() * poems.length)];
  wakaText.textContent = poem;

  // Build categories
  var catData = categoryFortunes[level];
  var html = '';
  var catNames = ['願望', '待人', '失物', '旅行', '商売', '学問', '恋愛'];
  for (var i = 0; i < catNames.length; i++) {
    var name = catNames[i];
    html += '<div class="fortune-category">';
    html += '<span class="category-label">' + name + '</span>';
    html += '<span class="category-value">' + catData[name] + '</span>';
    html += '</div>';
  }
  categories.innerHTML = html;

  // Show result with animation
  result.classList.add('visible');
  result.classList.add('fade-in');

  // Smooth scroll to result
  setTimeout(function() {
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ── 九星気学機能 ──

function calculateKyusei() {
  var yearInput = document.getElementById('birthYear');
  var monthInput = document.getElementById('birthMonth');
  var dayInput = document.getElementById('birthDay');

  var year = parseInt(yearInput.value);
  var month = parseInt(monthInput.value);
  var day = parseInt(dayInput.value);

  if (!year || !month || !day || year < 1920 || year > 2026 || month < 1 || month > 12 || day < 1 || day > 31) {
    alert('正しい生年月日を入力してください。');
    return;
  }

  // Nine Star Ki: the year changes on February 4 (Setsubun/Risshun)
  // If born before Feb 4, use previous year
  var calcYear = year;
  if (month === 1 || (month === 2 && day < 4)) {
    calcYear = year - 1;
  }

  // Formula: sum all digits of year, reduce to single digit, then (11 - result) % 9
  // If result is 0, it becomes 9
  var digitSum = sumDigits(calcYear);
  while (digitSum > 9) {
    digitSum = sumDigits(digitSum);
  }

  var starNumber = 11 - digitSum;
  if (starNumber > 9) {
    starNumber = starNumber - 9;
  }
  if (starNumber <= 0) {
    starNumber = starNumber + 9;
  }

  var star = kyuseiStars[starNumber - 1];
  displayKyuseiResult(star);
}

function sumDigits(n) {
  var s = String(n);
  var total = 0;
  for (var i = 0; i < s.length; i++) {
    total += parseInt(s[i]);
  }
  return total;
}

function displayKyuseiResult(star) {
  var result = document.getElementById('kyuseiResult');
  var circle = document.getElementById('starCircle');
  var nameEl = document.getElementById('starName');
  var elementEl = document.getElementById('kyuseiElement');
  var fortuneEl = document.getElementById('kyuseiFortune');

  // Set star name
  nameEl.textContent = star.name;

  // Set element class for color
  circle.className = 'star-circle ' + star.element;

  // Set element text
  elementEl.textContent = '五行：' + star.elementName + '　━　' + star.name;

  // Set fortune
  fortuneEl.textContent = star.fortune;

  // Show with animation
  result.classList.remove('visible');
  result.classList.remove('fade-in');
  void result.offsetWidth;
  result.classList.add('visible');
  result.classList.add('fade-in');

  // Smooth scroll
  setTimeout(function() {
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ── Also allow clicking the omikuji box to draw ──
document.getElementById('omikujiBox').addEventListener('click', function() {
  drawOmikuji();
});
