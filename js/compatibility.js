// ========================================
// Compatibility Diagnosis (相性診断) - Celestia
// ========================================

let currentDiagnosis = null;

// Initialize date selects on load
document.addEventListener('DOMContentLoaded', () => {
  initDateSelects('year1', 'month1', 'day1');
  initDateSelects('year2', 'month2', 'day2');
});

function initDateSelects(yearId, monthId, dayId) {
  const yearEl = document.getElementById(yearId);
  const monthEl = document.getElementById(monthId);
  const dayEl = document.getElementById(dayId);

  // Year: 1940-2010
  yearEl.innerHTML = '<option value="">年</option>';
  for (let y = 2010; y >= 1940; y--) {
    yearEl.innerHTML += `<option value="${y}">${y}年</option>`;
  }

  // Month: 1-12
  monthEl.innerHTML = '<option value="">月</option>';
  for (let m = 1; m <= 12; m++) {
    monthEl.innerHTML += `<option value="${m}">${m}月</option>`;
  }

  // Day: 1-31
  dayEl.innerHTML = '<option value="">日</option>';
  for (let d = 1; d <= 31; d++) {
    dayEl.innerHTML += `<option value="${d}">${d}日</option>`;
  }
}

// Phase management
function showPhase(phaseId) {
  document.querySelectorAll('[id^="phase-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById(phaseId).classList.remove('hidden');
}

// Hash string to number
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Generate deterministic score (0-100) from seed
function scoreFromSeed(seed, min, max) {
  // mulberry32-like
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const raw = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return Math.floor(raw * (max - min + 1)) + min;
}

// Calculate compatibility
function calculateCompatibility(name1, birth1, name2, birth2) {
  const combinedNames = name1 + name2;
  const nameHash = hashString(combinedNames);
  const reverseHash = hashString(name2 + name1);

  const birthSum1 = birth1.year + birth1.month + birth1.day;
  const birthSum2 = birth2.year + birth2.month + birth2.day;
  const birthDiff = Math.abs(birthSum1 - birthSum2);

  // Generate unique seeds for each aspect
  const overallSeed = nameHash + birthSum1 * 7 + birthSum2 * 13;
  const loveSeed = nameHash * 3 + reverseHash * 5 + birthDiff * 11;
  const workSeed = nameHash * 7 + birthSum1 * 17 + birthSum2 * 3;
  const commSeed = reverseHash * 11 + birthDiff * 23 + nameHash;

  const overall = scoreFromSeed(overallSeed, 25, 98);
  const love = scoreFromSeed(loveSeed, 20, 100);
  const work = scoreFromSeed(workSeed, 20, 100);
  const comm = scoreFromSeed(commSeed, 20, 100);

  return { overall, love, work, comm };
}

// Get level text and descriptions based on scores
function getLevelText(score) {
  if (score >= 80) return '最高の相性';
  if (score >= 60) return '良い相性';
  if (score >= 40) return 'まずまずの相性';
  return '努力が必要な相性';
}

const OVERALL_TEXTS = {
  high: [
    "二人は星の導きによって結ばれた特別な絆を持っています。お互いの存在が自然と力になり、一緒にいるだけで安心感が生まれます。この縁を大切に育んでいくことで、さらに深い関係が築かれるでしょう。",
    "天が定めたかのように、二人の波長は見事に調和しています。言葉にしなくても通じ合える部分が多く、共に過ごす時間が二人を成長させます。"
  ],
  good: [
    "二人の間には穏やかで温かい相性が流れています。多少の違いはありますが、それが互いを補い合う力となります。歩み寄りの姿勢を忘れなければ、より深い信頼関係を築くことができるでしょう。",
    "良い縁で結ばれた二人です。お互いの長所を認め合い、短所を補い合うことで、バランスの取れた関係を築けます。コミュニケーションを大切にすることがさらなる発展の鍵です。"
  ],
  fair: [
    "二人の相性は可もなく不可もなくといった状態です。互いを理解するには少し時間がかかるかもしれませんが、努力次第で関係は大きく変わります。相手の立場に立って考えることが大切です。",
    "異なる個性を持つ二人だからこそ、学び合えることがたくさんあります。表面的な違いに惑わされず、相手の内面を理解しようとする姿勢が関係を深めるでしょう。"
  ],
  low: [
    "二人の間には乗り越えるべき壁がありますが、それは成長のチャンスでもあります。互いの価値観の違いを受け入れ、根気強く対話を続けることで、唯一無二の絆が生まれる可能性を秘めています。",
    "星の配置から見ると試練の多い組み合わせですが、困難を共に乗り越えた先には深い絆が待っています。お互いを変えようとせず、ありのままを受け入れることが大切です。"
  ]
};

const LOVE_TEXTS = {
  high: [
    "恋愛面では抜群の相性です。二人の間には自然と情熱が生まれ、お互いの存在が心の支えとなります。ロマンチックな関係を長く維持できる素質があり、共に幸せな未来を描けるでしょう。",
    "運命的な恋の相性を持つ二人です。心が通い合い、一緒にいると時間を忘れるほどの充実感があります。"
  ],
  good: [
    "恋愛においても安定した関係を築ける相性です。お互いの気持ちを素直に伝え合うことで、信頼関係はさらに深まります。小さなサプライズや日常の感謝を忘れずに。",
    "穏やかで心地よい恋愛関係を築ける二人です。急がず焦らず、自然体で接することが長続きの秘訣です。"
  ],
  fair: [
    "恋愛面では波がある相性です。燃え上がる時期と冷める時期の差が大きいかもしれません。感情的にならず、冷静に相手と向き合うことで安定した関係を築けます。",
    "恋愛においては互いのペースの違いが課題になることがあります。無理に合わせるのではなく、互いの時間を尊重しましょう。"
  ],
  low: [
    "恋愛面では価値観の違いが表面化しやすい組み合わせです。しかし、違いを楽しめるようになれば、互いにない魅力を発見できます。焦らず、ゆっくりと距離を縮めていきましょう。",
    "恋愛の相性には課題がありますが、諦める必要はありません。まずは友人として信頼を築き、少しずつ関係を深めていくことをお勧めします。"
  ]
};

const WORK_TEXTS = {
  high: [
    "仕事のパートナーとしても素晴らしい組み合わせです。互いの強みを活かした協力体制が自然と構築され、二人で取り組むプロジェクトは大きな成果を上げるでしょう。",
    "ビジネス面での相性は申し分ありません。創造的なアイデアが互いの刺激で生まれ、高い生産性を発揮できる関係です。"
  ],
  good: [
    "仕事面ではバランスの良いチームを組める相性です。役割分担を明確にすることで、それぞれの力を最大限に発揮できます。定期的な意見交換が成功の鍵です。",
    "仕事における信頼関係を築きやすい相性です。お互いの得意分野を理解し、任せるところは任せることで効率的に物事が進みます。"
  ],
  fair: [
    "仕事面では方向性の違いが生じることがあります。プロジェクトの初期段階でしっかりと目標を共有し、進め方について合意しておくことが重要です。",
    "仕事のスタイルに違いがある二人ですが、それぞれの視点が新しい発見をもたらします。意見の対立を恐れず、建設的な議論を心がけましょう。"
  ],
  low: [
    "仕事面では考え方やアプローチの違いが大きく、衝突が起きやすい組み合わせです。お互いのやり方を否定せず、良い部分を取り入れる柔軟さが必要です。",
    "ビジネスにおいては意見が分かれやすい二人です。第三者の意見を取り入れたり、明確なルールを設けることで協力体制を築けます。"
  ]
};

const COMM_TEXTS = {
  high: [
    "コミュニケーションの相性は非常に良好です。言葉を交わさなくても伝わるような深い理解があり、会話は自然と弾みます。この心の通い合いが二人の関係の礎となるでしょう。",
    "会話のリズムが抜群に合う二人です。何気ない会話から深い話まで、どんな話題でも盛り上がれる素晴らしい相性です。"
  ],
  good: [
    "コミュニケーションは概ねスムーズです。意見が食い違う時も、落ち着いて話し合えば解決策が見つかります。相手の話にしっかり耳を傾ける姿勢が大切です。",
    "穏やかなコミュニケーションが取れる関係です。お互いの考えを尊重し合える土台があるので、どんな話題も前向きに話し合えます。"
  ],
  fair: [
    "コミュニケーション面ではすれ違いが生じることがあります。「伝えたつもり」が「伝わっていない」ことも。大切なことは直接、丁寧に言葉にして伝えましょう。",
    "表現方法の違いがコミュニケーションの壁になることがあります。相手がどう受け取るかを意識して言葉を選ぶことで、関係は改善されます。"
  ],
  low: [
    "コミュニケーション面では大きな課題があります。互いの言葉の受け取り方にズレが生じやすいため、誤解を防ぐために具体的な言葉で伝え合うことが必要です。",
    "意思疎通に苦労する場面が多い組み合わせです。感情的にならず、冷静に言葉を選んで伝えることが大切です。手紙やメッセージなど、文章でのやり取りが助けになることもあります。"
  ]
};

const ADVICE_TEXTS = {
  high: [
    "素晴らしい相性に恵まれた二人ですが、油断は禁物です。当たり前の幸せに感謝し、お互いを大切にし続けることで、この美しい関係はさらに輝きを増すでしょう。",
    "二人の絆はとても強いものです。その強さを過信せず、常に思いやりの心を忘れないでください。感謝の言葉を日頃から伝え合うことが、永遠の絆を育てます。"
  ],
  good: [
    "良い相性を持つ二人がさらに関係を深めるには、新しい体験を共有することが効果的です。一緒に旅行をしたり、新しい趣味に挑戦することで、二人の世界が広がります。",
    "相手の小さな変化に気づける観察力を養いましょう。「いつもありがとう」の一言が、二人の関係をさらに良いものにしていきます。"
  ],
  fair: [
    "互いの違いを「面白い」と思えるようになることが成長の鍵です。違いを乗り越えた先に、かけがえのない絆が待っています。焦らず、一歩ずつ歩み寄りましょう。",
    "二人の間にある壁は、実は成長のための踏み台です。困った時は一人で抱え込まず、素直に相手に助けを求めてみてください。"
  ],
  low: [
    "困難な相性だからこそ、乗り越えた時に得られるものは大きいです。相手を変えようとするのではなく、自分がどう変われるかを考えてみましょう。その姿勢が関係を動かす原動力になります。",
    "まずはお互いの「違い」を認めることから始めましょう。全てを理解し合う必要はありません。尊重し合える部分を一つずつ見つけていくことが、二人の未来を明るくします。"
  ]
};

function getTextCategory(score) {
  if (score >= 80) return 'high';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'low';
}

function pickText(texts, seed) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const raw = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  const index = Math.floor(raw * texts.length);
  return texts[index];
}

// Start diagnosis
function startDiagnosis() {
  const name1 = document.getElementById('name1').value.trim();
  const name2 = document.getElementById('name2').value.trim();
  const year1 = document.getElementById('year1').value;
  const month1 = document.getElementById('month1').value;
  const day1 = document.getElementById('day1').value;
  const year2 = document.getElementById('year2').value;
  const month2 = document.getElementById('month2').value;
  const day2 = document.getElementById('day2').value;

  // Validation
  if (!name1 || !name2) {
    alert('お二人の名前を入力してください。');
    return;
  }
  if (!year1 || !month1 || !day1 || !year2 || !month2 || !day2) {
    alert('お二人の生年月日を選択してください。');
    return;
  }

  const birth1 = { year: parseInt(year1), month: parseInt(month1), day: parseInt(day1) };
  const birth2 = { year: parseInt(year2), month: parseInt(month2), day: parseInt(day2) };

  showPhase('phase-loading');

  setTimeout(() => {
    const scores = calculateCompatibility(name1, birth1, name2, birth2);
    const seed = hashString(name1 + name2) + birth1.year + birth2.year;

    currentDiagnosis = {
      name1, name2, scores,
      level: getLevelText(scores.overall)
    };

    renderResult(currentDiagnosis, seed);
    showPhase('phase-result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 2000);
}

function renderResult(diagnosis, seed) {
  const { name1, name2, scores, level } = diagnosis;

  // Names
  document.getElementById('result-names').textContent = `${name1} × ${name2}`;

  // Circle percentage
  const circleEl = document.getElementById('compat-circle');
  circleEl.style.setProperty('--compat-pct', scores.overall + '%');
  document.getElementById('result-pct').textContent = scores.overall;

  // Level
  document.getElementById('result-level').textContent = level;

  // Texts
  const overallCat = getTextCategory(scores.overall);
  const loveCat = getTextCategory(scores.love);
  const workCat = getTextCategory(scores.work);
  const commCat = getTextCategory(scores.comm);

  document.getElementById('result-overall').textContent = pickText(OVERALL_TEXTS[overallCat], seed);
  document.getElementById('result-love').textContent = pickText(LOVE_TEXTS[loveCat], seed * 3);
  document.getElementById('result-work').textContent = pickText(WORK_TEXTS[workCat], seed * 7);
  document.getElementById('result-comm').textContent = pickText(COMM_TEXTS[commCat], seed * 11);
  document.getElementById('result-advice').textContent = pickText(ADVICE_TEXTS[overallCat], seed * 13);
}

// Reset
function resetDiagnosis() {
  currentDiagnosis = null;
  showPhase('phase-form');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Share
function shareTwitter() {
  if (!currentDiagnosis) return;
  const { name1, name2, scores, level } = currentDiagnosis;
  const text = encodeURIComponent(`Celestiaの相性診断で${name1}と${name2}の相性は${scores.overall}%（${level}）でした！\n`);
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareLine() {
  if (!currentDiagnosis) return;
  const { name1, name2, scores, level } = currentDiagnosis;
  const text = encodeURIComponent(`Celestiaの相性診断で${name1}と${name2}の相性は${scores.overall}%（${level}）でした！`);
  window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
}
