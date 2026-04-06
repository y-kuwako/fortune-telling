// ========================================
// UI Controller - Phase Management & Interactions
// ES Module - ui-controller.js
// ========================================

import { calcFourPillars, FIVE_ELEMENTS } from './pillars.js';
import { calcVedicAstrology } from './vedic.js';
import { runFortuneEngine } from './fortune-engine.js';
import { calcFlowLayer } from './sanmei.js';
import { calcShukuyoFlow } from './shukuyo.js';
import { calcHackLayer } from './shibi.js';

// --- State ---
let selectedGender = null;
let currentResult = null;

// --- Prefectures ---
const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県",
  "岐阜県","静岡県","愛知県","三重県",
  "滋賀県","京都府","大阪府","兵庫県","奈良県","和歌山県",
  "鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県",
  "福岡県","佐賀県","長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県",
  "海外"
];

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  initDateSelectors();
  initTimeSelectors();
  initPlaceSelector();
  initToggleHandlers();
  initGenderButtons();
  initAnalyzeButton();
  initResetButton();
  initLayerTabs();
  initShareButtons();
  initDownloadButton();
});

function initDateSelectors() {
  const yearSelect = document.getElementById('birth-year');
  const monthSelect = document.getElementById('birth-month');
  const daySelect = document.getElementById('birth-day');
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1930; y--) {
    const opt = document.createElement('option');
    opt.value = y; opt.textContent = `${y}年`;
    yearSelect.appendChild(opt);
  }
  for (let m = 1; m <= 12; m++) {
    const opt = document.createElement('option');
    opt.value = m; opt.textContent = `${m}月`;
    monthSelect.appendChild(opt);
  }
  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement('option');
    opt.value = d; opt.textContent = `${d}日`;
    daySelect.appendChild(opt);
  }
}

function initTimeSelectors() {
  const hourSelect = document.getElementById('birth-hour');
  const minuteSelect = document.getElementById('birth-minute');
  for (let h = 0; h <= 23; h++) {
    const opt = document.createElement('option');
    opt.value = h; opt.textContent = `${h}時`;
    hourSelect.appendChild(opt);
  }
  [0, 15, 30, 45].forEach(m => {
    const opt = document.createElement('option');
    opt.value = m; opt.textContent = `${String(m).padStart(2, '0')}分`;
    minuteSelect.appendChild(opt);
  });
}

function initPlaceSelector() {
  const placeSelect = document.getElementById('birth-place');
  PREFECTURES.forEach(pref => {
    const opt = document.createElement('option');
    opt.value = pref; opt.textContent = pref;
    placeSelect.appendChild(opt);
  });
}

function initToggleHandlers() {
  document.getElementById('time-unknown').addEventListener('change', (e) => {
    const group = document.getElementById('time-group');
    if (e.target.checked) {
      group.classList.add('form-group--disabled');
      document.getElementById('birth-hour').value = '';
      document.getElementById('birth-minute').value = '';
    } else {
      group.classList.remove('form-group--disabled');
    }
  });
  document.getElementById('place-unknown').addEventListener('change', (e) => {
    const group = document.getElementById('place-group');
    if (e.target.checked) {
      group.classList.add('form-group--disabled');
      document.getElementById('birth-place').value = '';
    } else {
      group.classList.remove('form-group--disabled');
    }
  });
}

function initGenderButtons() {
  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedGender = btn.dataset.gender;
      document.querySelectorAll('.gender-btn').forEach(b => {
        b.classList.remove('btn--primary');
        b.classList.add('btn--outline');
      });
      btn.classList.remove('btn--outline');
      btn.classList.add('btn--primary');
    });
  });
}

function initAnalyzeButton() {
  document.getElementById('btn-analyze').addEventListener('click', startAnalysis);
}

function initResetButton() {
  document.getElementById('btn-reset').addEventListener('click', resetAnalysis);
}

function initLayerTabs() {
  document.querySelectorAll('.layer-tabs__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.layer-tabs__tab').forEach(t =>
        t.classList.remove('layer-tabs__tab--active'));
      tab.classList.add('layer-tabs__tab--active');
      const layer = tab.dataset.layer;
      document.querySelectorAll('.layer-content').forEach(c =>
        c.classList.remove('layer-content--active'));
      document.querySelector(`[data-layer-content="${layer}"]`)
        .classList.add('layer-content--active');
    });
  });
}

function initShareButtons() {
  document.getElementById('btn-share-x').addEventListener('click', shareTwitter);
  document.getElementById('btn-share-line').addEventListener('click', shareLine);
}

function initDownloadButton() {
  document.getElementById('btn-download-card').addEventListener('click', downloadShareCard);
}

// --- Phase Management ---
function showPhase(phaseId) {
  document.querySelectorAll('[id^="phase-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById(phaseId).classList.remove('hidden');
}

// --- Loading Animation ---
function resetLoadingSteps() {
  document.querySelectorAll('.loading-v2__step').forEach(step => {
    step.classList.remove('loading-v2__step--active', 'loading-v2__step--done');
  });
}

function activateStep(stepNum) {
  const step = document.querySelector(`.loading-v2__step[data-step="${stepNum}"]`);
  if (!step) return;
  document.querySelectorAll('.loading-v2__step').forEach(s => {
    if (parseInt(s.dataset.step) < stepNum) {
      s.classList.remove('loading-v2__step--active');
      s.classList.add('loading-v2__step--done');
    }
  });
  step.classList.add('loading-v2__step--active');
}

function completeAllSteps() {
  document.querySelectorAll('.loading-v2__step').forEach(s => {
    s.classList.remove('loading-v2__step--active');
    s.classList.add('loading-v2__step--done');
  });
}

// --- Main Analysis Flow ---
async function startAnalysis() {
  const year = parseInt(document.getElementById('birth-year').value);
  const month = parseInt(document.getElementById('birth-month').value);
  const day = parseInt(document.getElementById('birth-day').value);

  if (!year || !month || !day) {
    alert('生年月日を入力してください');
    return;
  }

  const timeUnknown = document.getElementById('time-unknown').checked;
  const placeUnknown = document.getElementById('place-unknown').checked;
  const hour = timeUnknown ? null : (document.getElementById('birth-hour').value === '' ? null : parseInt(document.getElementById('birth-hour').value));
  const place = placeUnknown ? null : (document.getElementById('birth-place').value || null);

  resetLoadingSteps();
  showPhase('phase-loading');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Step 1: Four Pillars
  activateStep(1);
  await delay(1000);
  const pillarsData = calcFourPillars(year, month, day, hour);

  // Step 2: Vedic astrology
  activateStep(2);
  await delay(1000);
  const vedicData = calcVedicAstrology(year, month, day);

  // Step 3: AI analysis
  activateStep(3);
  const birthData = { year, month, day, hour, place, gender: selectedGender, timeUnknown, placeUnknown };
  const result = await runFortuneEngine(birthData, pillarsData, vedicData);

  // FLOW & HACK layers
  const flowData = calcFlowLayer(year, month, day, selectedGender);
  const shukuyoData = calcShukuyoFlow(year, month, day);
  const hackData = calcHackLayer(year, month, day, hour);

  // Step 4: Complete
  completeAllSteps();
  await delay(500);

  currentResult = { ...result, flowData, shukuyoData, hackData, pillarsData, vedicData, birthData };
  displayResult(currentResult, pillarsData, vedicData);
  displayFlowLayer(flowData, shukuyoData);
  displayHackLayer(hackData, pillarsData, vedicData);
  showPhase('phase-result');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// CORE Layer Display
// ========================================
function displayResult(result, pillarsData, vedicData) {
  // Header
  document.getElementById('astro-symbol').textContent = vedicData.nakshatra.symbol;
  document.getElementById('astro-title').textContent = result.title;
  document.getElementById('astro-subtitle').textContent = result.subtitle;

  // FREE Score
  renderFreeScore(result, pillarsData);

  // Hit Experience (的中体験)
  renderHitExperience(result.birthData, pillarsData);

  // Contradiction (矛盾提示)
  renderContradiction(pillarsData, vedicData);

  // Pillars Chart
  renderPillarsChart(pillarsData);

  // Element Balance
  renderElementChart(result.elementBalance || pillarsData.elementBalance);

  // Vedic Info
  renderVedicInfo(vedicData);

  // Traits
  renderTraits(result.strengths, result.weaknesses);

  // Daily Advice
  if (result.dailyAdvice) {
    document.getElementById('daily-advice').textContent = result.dailyAdvice;
    document.getElementById('daily-advice-box').style.display = '';
  }

  // Fortune texts
  document.getElementById('astro-overall').textContent = result.overall;
  document.getElementById('astro-career').textContent = result.career;
  document.getElementById('astro-love').textContent = result.love;
  document.getElementById('astro-money').textContent = result.money;
  document.getElementById('astro-health').textContent = result.health;

  // Share Card
  renderShareCard(result, pillarsData);

  // Reset tabs
  document.querySelectorAll('.layer-tabs__tab').forEach(t => t.classList.remove('layer-tabs__tab--active'));
  document.querySelector('[data-layer="core"]').classList.add('layer-tabs__tab--active');
  document.querySelectorAll('.layer-content').forEach(c => c.classList.remove('layer-content--active'));
  document.querySelector('[data-layer-content="core"]').classList.add('layer-content--active');
}

function renderFreeScore(result, pillarsData) {
  const score = calcOverallScore(pillarsData);
  const el = pillarsData.dominantElement;
  const elInfo = FIVE_ELEMENTS[el];
  const container = document.getElementById('free-score');
  container.innerHTML = `
    <div class="free-score__number">${score}</div>
    <div class="free-score__label">TODAY'S SCORE</div>
    <div class="free-score__element">${elInfo.symbol} ${el}の気質</div>
    <div class="free-score__insight">${result.dailyAdvice || ''}</div>
  `;
}

function calcOverallScore(pillarsData) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const x = Math.sin(seed + pillarsData.dayPillar.stem.element.charCodeAt(0)) * 10000;
  const rand = x - Math.floor(x);
  return Math.floor(rand * 35) + 60; // 60-94
}

function renderHitExperience(birthData, pillarsData) {
  const container = document.getElementById('hit-experience');
  if (!birthData) { container.style.display = 'none'; return; }

  const currentYear = new Date().getFullYear();
  const age = currentYear - birthData.year;
  if (age < 10) { container.style.display = 'none'; return; }

  // 天中殺やダシャー切替の年を過去から探す
  const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const dayBranchIdx = BRANCHES.indexOf(pillarsData.dayPillar.branch.name);
  const tcGroupIdx = Math.floor(((dayBranchIdx % 12) + 12) % 12 / 2) % 6;
  const tcBranches = [BRANCHES[tcGroupIdx * 2], BRANCHES[tcGroupIdx * 2 + 1]];

  const hitYears = [];
  for (let y = birthData.year + 10; y < currentYear; y++) {
    const yBranch = BRANCHES[(y - 4) % 12];
    if (tcBranches.includes(yBranch)) hitYears.push(y);
  }

  // 最も最近の天中殺期間を選択
  const recentHit = hitYears.length > 0 ? hitYears[hitYears.length - 1] : null;
  if (!recentHit) { container.style.display = 'none'; return; }

  container.style.display = '';
  container.innerHTML = `
    <div class="hit-experience__label">&#9734; AI的中検証</div>
    <div class="hit-experience__text">
      <span class="hit-experience__year">${recentHit}年</span>頃、<br>
      環境の大きな変化や、人生の転機となる出来事はありませんでしたか？<br>
      <small style="color: var(--text-muted-light);">天中殺の影響により、この時期に大きな変動が起きやすい命式です。</small>
    </div>
  `;
}

function renderContradiction(pillarsData, vedicData) {
  const container = document.getElementById('contradiction');
  const fourPillarElement = pillarsData.dominantElement;
  const vedicElement = vedicData.rashi.element;

  // 五行とヴェーダのエレメントの対応をチェック
  const elementMap = { "火": "火", "水": "水", "木": "風", "金": "地", "土": "地" };
  const mappedElement = elementMap[fourPillarElement];

  if (mappedElement === vedicElement) {
    container.style.display = 'none';
    return;
  }

  container.style.display = '';
  container.innerHTML = `
    <div class="contradiction__label">&#9888; 二占術のねじれをAIが解明</div>
    <div class="contradiction__grid">
      <div class="contradiction__side">
        <div class="contradiction__side-label">四柱推命</div>
        <div class="contradiction__side-value">${FIVE_ELEMENTS[fourPillarElement].symbol} ${fourPillarElement}の気質</div>
      </div>
      <div class="contradiction__vs">VS</div>
      <div class="contradiction__side">
        <div class="contradiction__side-label">インド占星術</div>
        <div class="contradiction__side-value">${vedicData.rashi.jaName}（${vedicElement}）</div>
      </div>
    </div>
    <div class="contradiction__resolution">
      四柱推命では「${pillarsData.dayStem.trait}」とされる一方、ヴェーダ占星術では${vedicData.rashi.jaName}の${vedicElement}のエネルギーが示されています。この「ねじれ」は弱点ではなく、<strong style="color:var(--gold);">二面性という武器</strong>です。状況に応じて${fourPillarElement}と${vedicElement}を使い分けられる柔軟さがあなたの強みです。
    </div>
  `;
}

function renderPillarsChart(data) {
  const container = document.getElementById('pillars-chart');
  const pillars = [
    { name: "年柱", pillar: data.yearPillar },
    { name: "月柱", pillar: data.monthPillar },
    { name: "日柱", pillar: data.dayPillar }
  ];
  if (data.hourPillar) {
    pillars.push({ name: "時柱", pillar: data.hourPillar });
    container.classList.remove('pillars-chart--three-col');
  } else {
    container.classList.add('pillars-chart--three-col');
  }
  container.innerHTML = pillars.map(p => `
    <div class="pillars-chart__item">
      <div class="pillars-chart__pillar-name">${p.name}</div>
      <div class="pillars-chart__pillar-value">${p.pillar.label}</div>
      <div class="pillars-chart__pillar-detail">${p.pillar.stem.element}（${p.pillar.stem.yin_yang}）/ ${p.pillar.branch.animal}</div>
    </div>
  `).join('');
}

function renderElementChart(balance) {
  const container = document.getElementById('element-bars');
  const elements = [
    { key: "木", cssClass: "wood" }, { key: "火", cssClass: "fire" },
    { key: "土", cssClass: "earth" }, { key: "金", cssClass: "metal" }, { key: "水", cssClass: "water" }
  ];
  container.innerHTML = elements.map(el => `
    <div class="element-chart__row">
      <span class="element-chart__label">${FIVE_ELEMENTS[el.key].symbol} ${el.key}</span>
      <div class="element-chart__bar-bg">
        <div class="element-chart__bar element-chart__bar--${el.cssClass}" data-width="${balance[el.key]}"></div>
      </div>
      <span class="element-chart__value">${balance[el.key]}%</span>
    </div>
  `).join('');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      container.querySelectorAll('.element-chart__bar').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    });
  });
}

function renderVedicInfo(data) {
  const container = document.getElementById('vedic-info');
  container.innerHTML = `
    <div class="vedic-info__item">
      <div class="vedic-info__label">ナクシャトラ（27宿）</div>
      <div class="vedic-info__value">${data.nakshatra.symbol} ${data.nakshatra.name}</div>
      <div class="vedic-info__sub">${data.nakshatra.deity}の守護 / 第${data.pada}パダ</div>
    </div>
    <div class="vedic-info__item">
      <div class="vedic-info__label">ラーシ（星座）</div>
      <div class="vedic-info__value">${data.rashi.jaName}</div>
      <div class="vedic-info__sub">${data.rashi.name} / ${data.rashi.ruler}支配</div>
    </div>
    <div class="vedic-info__item">
      <div class="vedic-info__label">ダシャー（現在の惑星期）</div>
      <div class="vedic-info__value">${data.dasha.ruler}期</div>
      <div class="vedic-info__sub">${data.dasha.period} / 残り${data.dasha.remaining}年</div>
    </div>
    <div class="vedic-info__item">
      <div class="vedic-info__label">グナ / 人生目標</div>
      <div class="vedic-info__value">${data.nakshatra.guna}</div>
      <div class="vedic-info__sub">${data.nakshatra.aim}</div>
    </div>
  `;
}

function renderTraits(strengths, weaknesses) {
  const container = document.getElementById('traits-grid');
  if (!strengths || !weaknesses) { container.innerHTML = ''; return; }
  container.innerHTML = `
    <div class="traits-box">
      <div class="traits-box__title">&#9650; STRENGTHS</div>
      <ul class="traits-box__list">${strengths.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
    <div class="traits-box traits-box--weakness">
      <div class="traits-box__title">&#9661; WATCH OUT</div>
      <ul class="traits-box__list">${weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
    </div>
  `;
}

// ========================================
// FLOW Layer Display
// ========================================
function displayFlowLayer(flowData, shukuyoData) {
  // 天中殺
  const tcEl = document.getElementById('flow-tenchusatsu');
  const nextTc = flowData.tenchusatsuYears.filter(y => y >= new Date().getFullYear());
  tcEl.innerHTML = `
    <div class="result__box-title">&#10023; 天中殺（${flowData.tenchusatsu.name}）</div>
    <p class="result__box-text">
      ${flowData.tenchusatsu.trait}<br>
      <small style="color:var(--text-muted-light);">${flowData.tenchusatsu.period}</small><br><br>
      ${nextTc.length > 0
        ? `次の天中殺: <strong style="color:var(--gold);">${nextTc.join('年・')}年</strong>`
        : '直近3年間に天中殺はありません。'}
    </p>
  `;

  // 大運
  const taiunEl = document.getElementById('flow-taiun');
  const ct = flowData.currentTaiun;
  taiunEl.innerHTML = `
    <div class="result__box-title">&#10023; 現在の大運</div>
    <p class="result__box-text">
      <strong style="color:var(--gold);font-size:1.1rem;">${ct.label}</strong>
      （${ct.fromYear}〜${ct.toYear}年 / ${ct.fromAge}〜${ct.toAge}歳）<br><br>
      今年の年運: <strong>${flowData.currentNenun.label}</strong>
    </p>
  `;

  // 運気カレンダー
  const calEl = document.getElementById('flow-calendar');
  calEl.innerHTML = flowData.yearlyForecast.map(yf => `
    <div class="energy-calendar__year">
      <div class="energy-calendar__year-label">
        ${yf.year}年
        <span class="energy-calendar__year-tag${yf.isTenchusatsu ? ' energy-calendar__year-tag--danger' : ''}">${yf.isTenchusatsu ? '天中殺' : yf.label}</span>
        エネルギー: ${yf.energy}%
      </div>
      <div class="energy-calendar__months">
        ${yf.months.map(m => `
          <div class="energy-calendar__month">
            <div class="energy-calendar__month-num">${m.month}月</div>
            <div class="energy-calendar__month-bar energy-calendar__month-bar--${m.energy >= 65 ? 'high' : m.energy >= 45 ? 'mid' : 'low'}" style="height:${Math.max(8, m.energy * 0.4)}px;"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  // 宿曜
  const shEl = document.getElementById('flow-shukuyo');
  shEl.innerHTML = `
    <div class="vedic-info__item">
      <div class="vedic-info__label">本命宿</div>
      <div class="vedic-info__value">${shukuyoData.birthShukuyo.name}</div>
      <div class="vedic-info__sub">${shukuyoData.birthShukuyo.personality}</div>
    </div>
    <div class="vedic-info__item">
      <div class="vedic-info__label">今日の宿</div>
      <div class="vedic-info__value">${shukuyoData.todayShukuyo.name}</div>
      <div class="vedic-info__sub">${shukuyoData.todayRelation.label}（相性${shukuyoData.todayRelation.score}%）</div>
    </div>
    <div class="vedic-info__item">
      <div class="vedic-info__label">今日の関係性</div>
      <div class="vedic-info__value">${shukuyoData.todayRelation.type}</div>
      <div class="vedic-info__sub">${shukuyoData.todayRelation.desc}</div>
    </div>
    <div class="vedic-info__item">
      <div class="vedic-info__label">幸運分野</div>
      <div class="vedic-info__value">${shukuyoData.birthShukuyo.luck}</div>
      <div class="vedic-info__sub">${shukuyoData.birthShukuyo.element}の宿</div>
    </div>
  `;
}

// ========================================
// HACK Layer Display
// ========================================
function displayHackLayer(hackData, pillarsData, vedicData) {
  // AI Character (軍師)
  const charEl = document.getElementById('hack-character');
  const dayOfWeek = new Date().getDay();
  const charMessages = generateCharacterMessage(hackData, pillarsData, dayOfWeek);
  charEl.innerHTML = `
    <div class="ai-character__avatar">&#9876;</div>
    <div class="ai-character__body">
      <div class="ai-character__name">&#9734; CELESTIA 軍師</div>
      <div class="ai-character__message">${charMessages}</div>
    </div>
  `;

  // Scores
  const scoresEl = document.getElementById('hack-scores');
  const s = hackData.scores;
  scoresEl.innerHTML = `
    <div class="vedic-info__item">
      <div class="vedic-info__label">総合</div>
      <div class="vedic-info__value">${s.overall}%</div>
    </div>
    <div class="vedic-info__item">
      <div class="vedic-info__label">集中力</div>
      <div class="vedic-info__value">${s.concentration}%</div>
    </div>
    <div class="vedic-info__item">
      <div class="vedic-info__label">対人運</div>
      <div class="vedic-info__value">${s.social}%</div>
    </div>
    <div class="vedic-info__item">
      <div class="vedic-info__label">創造力</div>
      <div class="vedic-info__value">${s.creativity}%</div>
    </div>
  `;

  // Hourly Chart
  const hourlyEl = document.getElementById('hack-hourly');
  hourlyEl.innerHTML = `
    <div class="hourly-chart__title">&#9672; 時 間 帯 別 最 適 化</div>
    <div class="hourly-chart__row">
      <div>時間帯</div><div>集中力</div><div>対人運</div><div>創造力</div>
    </div>
    ${hackData.hourlyOptimization.map(slot => {
      const cClass = slot.concentration >= 60 ? 'high' : slot.concentration >= 45 ? 'mid' : 'low';
      const sClass = slot.social >= 60 ? 'high' : slot.social >= 45 ? 'mid' : 'low';
      const crClass = slot.creativity >= 60 ? 'high' : slot.creativity >= 45 ? 'mid' : 'low';
      return `
        <div class="hourly-chart__row">
          <div class="hourly-chart__label">${slot.label}</div>
          <div class="hourly-chart__cell hourly-chart__cell--${cClass}">${slot.concentration}%</div>
          <div class="hourly-chart__cell hourly-chart__cell--${sClass}">${slot.social}%</div>
          <div class="hourly-chart__cell hourly-chart__cell--${crClass}">${slot.creativity}%</div>
        </div>`;
    }).join('')}
  `;

  // TODO List
  const todosEl = document.getElementById('hack-todos');
  todosEl.innerHTML = `
    <div class="todo-list__title">&#9734; TODAY'S ACTION PLAN</div>
    ${hackData.todos.map(todo => `
      <div class="todo-item">
        <div class="todo-item__priority todo-item__priority--${todo.priority}"></div>
        <div class="todo-item__content">
          <div class="todo-item__time">${todo.time}</div>
          <div class="todo-item__action">${todo.action}</div>
          <div class="todo-item__reason">${todo.reason}</div>
        </div>
      </div>
    `).join('')}
  `;
}

function generateCharacterMessage(hackData, pillarsData, dayOfWeek) {
  const s = hackData.scores;
  const bestSlot = hackData.hourlyOptimization.reduce((best, slot) =>
    (slot.concentration + slot.social + slot.creativity) > (best.concentration + best.social + best.creativity) ? slot : best,
    hackData.hourlyOptimization[0]);

  const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
  const element = pillarsData.dominantElement;

  let msg = `おはようございます。${dayNames[dayOfWeek]}曜日の戦略ブリーフィングです。\n\n`;
  msg += `本日の総合エネルギーは <strong style="color:var(--gold);">${s.overall}%</strong>。`;

  if (s.overall >= 70) {
    msg += `好調です。攻めの姿勢で大丈夫。`;
  } else if (s.overall >= 50) {
    msg += `平常運行です。基本に忠実に。`;
  } else {
    msg += `やや低調。無理せず守りの一日に。`;
  }

  msg += `\n\n最も効率的な時間帯は <strong style="color:var(--gold);">${bestSlot.label}（${bestSlot.range}）</strong>。`;
  msg += `この時間に最重要タスクを集中投下してください。`;

  return msg;
}

// ========================================
// Share Card (Canvas API)
// ========================================
function renderShareCard(result, pillarsData) {
  const canvas = document.getElementById('share-card-canvas');
  const ctx = canvas.getContext('2d');
  const w = 600, h = 315;

  // Background
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0e0e2a');
  grad.addColorStop(1, '#1a1a3e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Border
  ctx.strokeStyle = 'rgba(201, 169, 110, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  // Title
  ctx.fillStyle = 'rgba(201, 169, 110, 0.6)';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('C E L E S T I A   A I   A N A L Y S I S', w / 2, 50);

  // Score
  const score = calcOverallScore(pillarsData);
  ctx.fillStyle = '#c9a96e';
  ctx.font = 'bold 72px sans-serif';
  ctx.fillText(String(score), w / 2, 140);

  ctx.fillStyle = 'rgba(201, 169, 110, 0.5)';
  ctx.font = '10px sans-serif';
  ctx.fillText("TODAY'S SCORE", w / 2, 160);

  // Element
  const el = pillarsData.dominantElement;
  const elInfo = FIVE_ELEMENTS[el];
  ctx.fillStyle = '#dcc28e';
  ctx.font = '14px sans-serif';
  ctx.fillText(`${elInfo.symbol} ${el}の気質 × ${result.title}`, w / 2, 200);

  // Insight
  if (result.dailyAdvice) {
    ctx.fillStyle = 'rgba(232, 228, 220, 0.7)';
    ctx.font = '11px sans-serif';
    const adviceText = result.dailyAdvice.length > 40 ? result.dailyAdvice.slice(0, 40) + '...' : result.dailyAdvice;
    ctx.fillText(adviceText, w / 2, 235);
  }

  // CTA
  ctx.fillStyle = 'rgba(201, 169, 110, 0.4)';
  ctx.font = '9px sans-serif';
  ctx.fillText('あなたも診断する →', w / 2, 285);

  document.getElementById('share-card-container').style.display = '';
}

function downloadShareCard() {
  const canvas = document.getElementById('share-card-canvas');
  // data URLを使い、aタグのdownload属性でファイル名を強制
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.setAttribute('download', 'celestia-fortune.png');
  link.setAttribute('href', dataUrl);
  link.style.display = 'none';
  document.body.appendChild(link);
  // setTimeout でブラウザにDOM反映を待たせてからクリック
  setTimeout(() => {
    link.click();
    document.body.removeChild(link);
  }, 100);
}

// --- Reset ---
function resetAnalysis() {
  currentResult = null;
  selectedGender = null;
  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.classList.remove('btn--primary');
    btn.classList.add('btn--outline');
  });
  showPhase('phase-input');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Share ---
function shareTwitter() {
  if (!currentResult) return;
  const text = encodeURIComponent(
    `🌟 Celestia AI命術解析：「${currentResult.title}」\n${currentResult.overall.slice(0, 60)}...\n`
  );
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareLine() {
  if (!currentResult) return;
  const text = encodeURIComponent(
    `🌟 Celestia AI命術解析：「${currentResult.title}」\n${currentResult.overall.slice(0, 60)}...`
  );
  window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
}

// --- Utility ---
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
