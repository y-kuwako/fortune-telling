// ========================================
// Tarot Card Reading - Celestia
// ========================================

const TAROT_CARDS = [
  {
    name: "愚者",
    nameEn: "The Fool",
    icon: "🌀",
    message: "新しい旅の始まりを告げるカードです。未知への恐れを手放し、子どものような純粋さで一歩を踏み出しましょう。今のあなたには無限の可能性が広がっています。",
    advice: "深く考えすぎず、直感を信じて行動してみてください。失敗を恐れる必要はありません。",
    lucky: "ラッキーカラー: スカイブルー / ラッキーナンバー: 0"
  },
  {
    name: "魔術師",
    nameEn: "The Magician",
    icon: "✨",
    message: "あなたには全てを実現する力が備わっています。手元にある資源を最大限に活かし、意志の力で現実を動かす時です。集中力が鍵となります。",
    advice: "今持っているスキルや人脈を棚卸ししてみましょう。答えはすでにあなたの中にあります。",
    lucky: "ラッキーカラー: イエロー / ラッキーナンバー: 1"
  },
  {
    name: "女教皇",
    nameEn: "The High Priestess",
    icon: "🌙",
    message: "静かな直感の声に耳を傾けてください。表面的な情報だけでなく、心の奥底にある知恵があなたを導きます。沈黙の中にこそ答えがあります。",
    advice: "瞑想や日記をつけるなど、内省の時間を作りましょう。急いで結論を出す必要はありません。",
    lucky: "ラッキーカラー: シルバー / ラッキーナンバー: 2"
  },
  {
    name: "女帝",
    nameEn: "The Empress",
    icon: "👑",
    message: "豊かさと愛に満ちた時期です。創造性が高まり、あなたの周りに美しいものが引き寄せられます。自分自身を慈しむことで、さらなる恵みが訪れるでしょう。",
    advice: "自然の中で過ごす時間を増やし、五感を満たす体験をしてみてください。",
    lucky: "ラッキーカラー: エメラルドグリーン / ラッキーナンバー: 3"
  },
  {
    name: "皇帝",
    nameEn: "The Emperor",
    icon: "🏛️",
    message: "安定と秩序を築く時です。リーダーシップを発揮し、計画的に物事を進めることで大きな成果が得られます。責任を引き受ける覚悟を持ちましょう。",
    advice: "明確な目標を設定し、具体的なスケジュールを立てましょう。構造化された取り組みが成功をもたらします。",
    lucky: "ラッキーカラー: ロイヤルレッド / ラッキーナンバー: 4"
  },
  {
    name: "教皇",
    nameEn: "The Hierophant",
    icon: "📿",
    message: "伝統や教えの中に今必要な答えがあります。信頼できるメンターや先人の知恵に学ぶ時です。精神的な成長が人生に新しい意味をもたらします。",
    advice: "尊敬する人に相談してみましょう。また、学びの機会を積極的に活用してください。",
    lucky: "ラッキーカラー: ネイビー / ラッキーナンバー: 5"
  },
  {
    name: "恋人",
    nameEn: "The Lovers",
    icon: "💞",
    message: "大切な選択の時が訪れています。心に従い、愛と調和を選ぶことで正しい道が開けます。パートナーシップにおいても深い絆が生まれるでしょう。",
    advice: "頭で考えるよりも心で感じることを優先してみてください。愛を基準に選択をしましょう。",
    lucky: "ラッキーカラー: ピンク / ラッキーナンバー: 6"
  },
  {
    name: "戦車",
    nameEn: "The Chariot",
    icon: "⚔️",
    message: "強い意志と行動力で勝利を掴む時です。困難に立ち向かう勇気を持ち、迷いを振り払って前進しましょう。自信を持って進めば道は開けます。",
    advice: "明確な目的意識を持ち、脇道にそれずに突き進みましょう。今は行動あるのみです。",
    lucky: "ラッキーカラー: オレンジ / ラッキーナンバー: 7"
  },
  {
    name: "力",
    nameEn: "Strength",
    icon: "🦁",
    message: "内なる強さが試される時です。力任せではなく、忍耐と優しさで困難を乗り越えましょう。穏やかな心こそが最大の武器です。",
    advice: "感情的になりそうな場面でも、一呼吸おいて冷静に対処しましょう。柔よく剛を制します。",
    lucky: "ラッキーカラー: ゴールド / ラッキーナンバー: 8"
  },
  {
    name: "隠者",
    nameEn: "The Hermit",
    icon: "🏔️",
    message: "一人の時間が今のあなたには必要です。外の喧騒から離れ、自分自身と向き合うことで大切な気づきが得られます。内なる光を信じてください。",
    advice: "SNSやニュースから少し距離を置き、読書や散歩など静かな時間を楽しみましょう。",
    lucky: "ラッキーカラー: グレー / ラッキーナンバー: 9"
  },
  {
    name: "運命の輪",
    nameEn: "Wheel of Fortune",
    icon: "🎡",
    message: "運命の転換期が訪れています。流れに身を任せることで、思いがけない幸運がやってきます。全ての出来事には意味があることを信じましょう。",
    advice: "変化を恐れず受け入れてください。今起きていることは、より良い未来への布石です。",
    lucky: "ラッキーカラー: パープル / ラッキーナンバー: 10"
  },
  {
    name: "正義",
    nameEn: "Justice",
    icon: "⚖️",
    message: "公正さとバランスが求められています。正直に、そして誠実に行動することで正しい結果が訪れます。因果応報の法則が働いています。",
    advice: "偏りのない視点で物事を見つめ直しましょう。公平な判断が幸運を引き寄せます。",
    lucky: "ラッキーカラー: ホワイト / ラッキーナンバー: 11"
  },
  {
    name: "吊るされた男",
    nameEn: "The Hanged Man",
    icon: "🔄",
    message: "視点を変える時です。一見停滞に見える状況も、見方を変えれば新たな発見に溢れています。手放すことで得られるものがあります。",
    advice: "焦らず、今の状況を別の角度から眺めてみましょう。待つことも立派な行動です。",
    lucky: "ラッキーカラー: アクアブルー / ラッキーナンバー: 12"
  },
  {
    name: "死神",
    nameEn: "Death",
    icon: "🦋",
    message: "終わりは新しい始まりです。古いものを手放し、変容を受け入れましょう。今までの自分から脱皮して、より成長した自分へと生まれ変わる時です。",
    advice: "執着しているものを手放す勇気を持ちましょう。終わらせることで新しい扉が開きます。",
    lucky: "ラッキーカラー: ブラック / ラッキーナンバー: 13"
  },
  {
    name: "節制",
    nameEn: "Temperance",
    icon: "🌊",
    message: "調和とバランスが幸運を呼びます。極端な行動を避け、中庸を保つことで心身ともに安定します。穏やかな流れに身を委ねましょう。",
    advice: "生活リズムを整え、心と体のバランスを意識してください。急がば回れの精神で。",
    lucky: "ラッキーカラー: ラベンダー / ラッキーナンバー: 14"
  },
  {
    name: "悪魔",
    nameEn: "The Devil",
    icon: "🔗",
    message: "あなたを縛っているものは何ですか？依存や執着から自由になる時です。自分を制限している思い込みに気づき、真の自由を取り戻しましょう。",
    advice: "悪習慣やネガティブな思考パターンを一つずつ手放す努力をしてみてください。",
    lucky: "ラッキーカラー: ダークレッド / ラッキーナンバー: 15"
  },
  {
    name: "塔",
    nameEn: "The Tower",
    icon: "⚡",
    message: "予期せぬ変化が訪れますが、それは必要な浄化のプロセスです。崩壊の後にはより強固な基盤が築かれます。真実に目覚める時です。",
    advice: "変化に抵抗せず、柔軟に対応しましょう。壊れたものの中にある本質を見つけてください。",
    lucky: "ラッキーカラー: レッド / ラッキーナンバー: 16"
  },
  {
    name: "星",
    nameEn: "The Star",
    icon: "⭐",
    message: "希望の光が差し込んでいます。困難な時期を乗り越え、癒しと再生の時がやってきました。あなたの願いは必ず叶います。信じ続けてください。",
    advice: "夢や目標を改めて書き出し、ポジティブなビジョンを描きましょう。宇宙はあなたの味方です。",
    lucky: "ラッキーカラー: ライトブルー / ラッキーナンバー: 17"
  },
  {
    name: "月",
    nameEn: "The Moon",
    icon: "🌕",
    message: "不安や迷いが心を覆っているかもしれません。しかし、月明かりの下でこそ見える真実があります。直感を信じ、幻惑に惑わされないようにしましょう。",
    advice: "夢や直感的なメッセージに注意を払いましょう。答えは潜在意識の中にあります。",
    lucky: "ラッキーカラー: シルバー / ラッキーナンバー: 18"
  },
  {
    name: "太陽",
    nameEn: "The Sun",
    icon: "☀️",
    message: "喜びと成功に満ちた素晴らしい時期です！あなたの努力が実を結び、周囲にも明るいエネルギーが溢れます。自信を持って輝いてください。",
    advice: "この好調な波に乗り、積極的に行動しましょう。楽しむことが最大の開運法です。",
    lucky: "ラッキーカラー: オレンジ / ラッキーナンバー: 19"
  },
  {
    name: "審判",
    nameEn: "Judgement",
    icon: "🔔",
    message: "目覚めと再生の時です。過去を振り返り、学びを統合して新しいステージへ進みましょう。内なる呼び声に応える覚悟を持ってください。",
    advice: "過去に未解決だったことに向き合い、清算する時です。許しと感謝の心を持ちましょう。",
    lucky: "ラッキーカラー: ホワイトゴールド / ラッキーナンバー: 20"
  },
  {
    name: "世界",
    nameEn: "The World",
    icon: "🌍",
    message: "一つのサイクルが完成し、達成感に満たされる時です。全てが調和し、あなたは完全性を体現しています。次なるステージへの扉が開かれています。",
    advice: "これまでの歩みに感謝し、達成を祝いましょう。そして新たな冒険への準備を始めてください。",
    lucky: "ラッキーカラー: インディゴ / ラッキーナンバー: 21"
  }
];

const CARD_COUNT = 12;
let selectedCard = null;

// Phase Management
function showPhase(phaseId) {
  document.querySelectorAll('[id^="phase-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById(phaseId).classList.remove('hidden');
}

// Shuffle
function startShuffle() {
  showPhase('phase-shuffle');
  setTimeout(() => {
    generateCards();
    showPhase('phase-select');
  }, 2500);
}

// Generate Card Grid
function generateCards() {
  const grid = document.getElementById('card-grid');
  grid.innerHTML = '';

  const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, CARD_COUNT);

  selected.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'tarot-card';
    cardEl.dataset.index = index;
    cardEl.innerHTML = `
      <div class="tarot-card__inner">
        <div class="tarot-card__back"></div>
        <div class="tarot-card__front">
          <span class="tarot-card__front-icon">${card.icon}</span>
          <span>${card.name}</span>
        </div>
      </div>
    `;
    cardEl.addEventListener('click', () => selectCard(cardEl, card));

    // Staggered entrance animation
    cardEl.style.opacity = '0';
    cardEl.style.transform = 'scale(0.8)';
    setTimeout(() => {
      cardEl.style.transition = 'all 0.3s ease';
      cardEl.style.opacity = '1';
      cardEl.style.transform = 'scale(1)';
    }, index * 80);

    grid.appendChild(cardEl);
  });
}

// Select Card
function selectCard(cardEl, card) {
  if (selectedCard) return;
  selectedCard = card;

  // Flip selected card
  cardEl.classList.add('tarot-card--flipped');

  // Disable other cards
  document.querySelectorAll('.tarot-card').forEach(el => {
    if (el !== cardEl) el.classList.add('tarot-card--disabled');
  });

  // Show result after flip animation
  setTimeout(() => showResult(card), 1200);
}

// Show Result
function showResult(card) {
  document.getElementById('result-icon').textContent = card.icon;
  document.getElementById('result-name').textContent = `${card.name} - ${card.nameEn}`;
  document.getElementById('result-subtitle').textContent = 'あなたへのメッセージ';
  document.getElementById('result-message').textContent = card.message;
  document.getElementById('result-advice').textContent = card.advice;
  document.getElementById('result-lucky').textContent = card.lucky;

  showPhase('phase-result');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reset
function resetTarot() {
  selectedCard = null;
  showPhase('phase-start');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Share
function shareTwitter() {
  if (!selectedCard) return;
  const text = encodeURIComponent(`🔮 Celestiaのタロット占いで「${selectedCard.name}」が出ました！\n${selectedCard.message.slice(0, 60)}...\n`);
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareLine() {
  if (!selectedCard) return;
  const text = encodeURIComponent(`🔮 Celestiaのタロット占いで「${selectedCard.name}」が出ました！\n${selectedCard.message.slice(0, 60)}...`);
  window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
}
