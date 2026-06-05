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
import { getPlan, setPlan, canAccess, PLAN_DEFS } from './plan-manager.js';
import { signup, login, logout, getAccount, isLoggedIn } from './account.js';
import {
  recordTodayPrediction,
  recordActual,
  getMonthEntries,
  getMonthlySummary,
  ensureSeed,
  FOCUS_LABELS
} from './sync-log.js';
import {
  ensureMonthPlan,
  getMonthPlan,
  toggleAction,
  submitReflection,
  getOrCreateThisMonthPlan
} from './ai-coach.js';

const PLANS_REQUIRING_LOGIN = new Set(['basic', 'premium']);
let pendingPlanAfterAuth = null;
let syncLogMonthKey = null; // 表示中の月 'yyyy-mm'

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
  initPlanBadge();
  initPlanModal();
  initAuthModal();
  initSyncLogModal();
  initCoachModal();
  refreshPlanBadge();
  refreshSyncLogButton();
  refreshCoachButton();
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
  applyPaywall();
  maybeRecordTodayInLog();
  maybeEnsureCoachPlan();
  refreshSyncLogButton();
  refreshCoachButton();
  showPhase('phase-result');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function maybeRecordTodayInLog() {
  if (!currentResult) return;
  if (!canAccess('sync_log')) return;
  recordTodayPrediction({
    pillarsData: currentResult.pillarsData,
    hackData: currentResult.hackData,
    shukuyoData: currentResult.shukuyoData
  });
}

// ========================================
// CORE Layer Display
// ========================================
function displayResult(result, pillarsData, vedicData) {
  // Header
  document.getElementById('astro-symbol').textContent = vedicData.nakshatra.symbol;
  document.getElementById('astro-title').textContent = result.title;
  document.getElementById('astro-subtitle').textContent = result.subtitle;

  // FREE Score (FREE層も見える簡易ブリーフィング: スコア + 五行 + 最適時間)
  renderFreeScore(result, pillarsData, result.hackData);

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

function renderFreeScore(result, pillarsData, hackData) {
  const score = calcOverallScore(pillarsData);
  const el = pillarsData.dominantElement;
  const elInfo = FIVE_ELEMENTS[el];

  // 最適時間帯（HACK簡易: FREEでも見せる）
  let bestSlotLabel = '';
  if (hackData?.hourlyOptimization?.length) {
    const best = hackData.hourlyOptimization.reduce((b, s) =>
      (s.concentration + s.social + s.creativity) > (b.concentration + b.social + b.creativity) ? s : b,
      hackData.hourlyOptimization[0]);
    bestSlotLabel = `本日の最適時間帯: <strong>${best.label}（${best.range}）</strong>`;
  }

  const container = document.getElementById('free-score');
  container.innerHTML = `
    <div class="free-score__number">${score}</div>
    <div class="free-score__label">TODAY'S SCORE</div>
    <div class="free-score__element">${elInfo.symbol} ${el}の気質</div>
    <div class="free-score__insight">${result.dailyAdvice || ''}</div>
    ${bestSlotLabel ? `<div class="free-score__insight" style="font-size:0.78rem;opacity:0.85;">${bestSlotLabel}</div>` : ''}
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

  // Background - warm brown gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#2a1508');
  grad.addColorStop(0.5, '#3a2210');
  grad.addColorStop(1, '#4a2a15');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Watercolor splash accents
  const splashes = [
    { x: 50, y: 60, r: 80, color: 'rgba(232, 112, 64, 0.08)' },
    { x: w - 60, y: 40, r: 60, color: 'rgba(212, 64, 128, 0.06)' },
    { x: w / 2, y: h - 40, r: 100, color: 'rgba(240, 200, 48, 0.07)' },
    { x: 80, y: h - 50, r: 50, color: 'rgba(58, 154, 138, 0.06)' }
  ];
  splashes.forEach(s => {
    const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
    sg.addColorStop(0, s.color);
    sg.addColorStop(1, 'transparent');
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, w, h);
  });

  // Border
  ctx.strokeStyle = 'rgba(212, 160, 32, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(16, 16, w - 32, h - 32);

  // Title
  ctx.fillStyle = 'rgba(212, 160, 32, 0.6)';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('x — T E N   A I   A N A L Y S I S', w / 2, 50);

  // Score
  const score = calcOverallScore(pillarsData);
  ctx.fillStyle = '#e8bf4a';
  ctx.font = 'bold 72px sans-serif';
  ctx.fillText(String(score), w / 2, 140);

  ctx.fillStyle = 'rgba(212, 160, 32, 0.5)';
  ctx.font = '10px sans-serif';
  ctx.fillText("TODAY'S SCORE", w / 2, 160);

  // Element
  const el = pillarsData.dominantElement;
  const elInfo = FIVE_ELEMENTS[el];
  ctx.fillStyle = '#e8bf4a';
  ctx.font = '14px sans-serif';
  ctx.fillText(`${elInfo.symbol} ${el}の気質 × ${result.title}`, w / 2, 200);

  // Insight
  if (result.dailyAdvice) {
    ctx.fillStyle = 'rgba(250, 243, 230, 0.7)';
    ctx.font = '11px sans-serif';
    const adviceText = result.dailyAdvice.length > 40 ? result.dailyAdvice.slice(0, 40) + '...' : result.dailyAdvice;
    ctx.fillText(adviceText, w / 2, 235);
  }

  // CTA
  ctx.fillStyle = 'rgba(212, 160, 32, 0.4)';
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
    `🌟 x-TEN AI命術解析：「${currentResult.title}」\n${currentResult.overall.slice(0, 60)}...\n`
  );
  const url = encodeURIComponent(window.location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareLine() {
  if (!currentResult) return;
  const text = encodeURIComponent(
    `🌟 x-TEN AI命術解析：「${currentResult.title}」\n${currentResult.overall.slice(0, 60)}...`
  );
  window.open(`https://social-plugins.line.me/lineit/share?text=${text}`, '_blank');
}

// ========================================
// Paywall Control
// ========================================
function applyPaywall() {
  // 1. data-feature を持つ要素を走査して is-locked を付け外し
  document.querySelectorAll('[data-feature]').forEach(el => {
    const feature = el.dataset.feature;
    if (canAccess(feature)) {
      el.classList.remove('is-locked');
    } else {
      el.classList.add('is-locked');
    }
  });

  // 2. CTA スロットを更新
  renderCtaSlot('core', {
    feature: 'core.detail',
    plan: 'shot',
    hook: '四柱推命 × インド占星術 × 紫微斗数。<br>あなたの仕事・対人・財運・健康まで、本日の行動レベルで解析します。',
    btn: '本日のフル鑑定をアンロック ¥100',
    note: '当日24時まで全鑑定が解放されます。'
  });

  renderCtaSlot('flow', {
    feature: 'flow.monthly',
    plan: 'basic',
    hook: '算命学 × 宿曜占星術による<strong>月間運勢</strong>。<br>天中殺・大運・宿曜の関係性を読み解きます。',
    btn: '月間運勢を見る ¥300/月',
    note: 'いつでも解約可能。'
  }, {
    // monthly が解除済みで yearly がロックなら年間用CTAに差し替え
    altFeature: 'flow.yearly',
    altPlan: 'premium',
    altHook: '<strong>年間カレンダー</strong>で1〜3年の運気の波を俯瞰。<br>AI対話タスク管理 / 運気ログ（Sync Log）も解放されます。',
    altBtn: '年間まで開く ¥500/月',
    altNote: 'PREMIUM: 月間+年間+AI対話+運気ログ。'
  });

  renderCtaSlot('hack', {
    feature: 'hack.full',
    plan: 'shot',
    hook: '時間帯別の<strong>集中力・対人運・創造力</strong>と、<br>本日のアクションプランをAI軍師がご提案。',
    btn: '本日のフル鑑定をアンロック ¥100',
    note: '当日24時まで全鑑定が解放されます。'
  });
}

function renderCtaSlot(slotId, primary, alt) {
  const slot = document.querySelector(`[data-cta-slot="${slotId}"]`);
  if (!slot) return;

  // primary 機能にアクセス可能なら、alt の判定へ
  if (canAccess(primary.feature)) {
    if (alt && !canAccess(alt.altFeature)) {
      slot.innerHTML = ctaHtml(alt.altHook, alt.altBtn, alt.altPlan, alt.altNote);
      bindCtaButton(slot, alt.altPlan);
      return;
    }
    slot.innerHTML = '';
    return;
  }

  slot.innerHTML = ctaHtml(primary.hook, primary.btn, primary.plan, primary.note);
  bindCtaButton(slot, primary.plan);
}

function ctaHtml(hook, btn, plan, note) {
  return `
    <div class="paywall-cta">
      <p class="paywall-cta__hook">${hook}</p>
      <button class="paywall-cta__btn" type="button" data-cta-target-plan="${plan}">${btn}</button>
      <p class="paywall-cta__note">${note}</p>
    </div>
  `;
}

function bindCtaButton(scope, targetPlan) {
  const btn = scope.querySelector('[data-cta-target-plan]');
  if (!btn) return;
  btn.addEventListener('click', () => openPlanModal(targetPlan));
}

// ========================================
// Plan Badge & Modal
// ========================================
function initPlanBadge() {
  const badge = document.getElementById('plan-badge');
  if (!badge) return;
  badge.addEventListener('click', () => openPlanModal());
}

function refreshPlanBadge() {
  const badge = document.getElementById('plan-badge');
  if (!badge) return;
  const planId = getPlan();
  const def = PLAN_DEFS[planId];
  badge.dataset.plan = planId;
  const valueEl = document.getElementById('plan-badge-value');
  if (valueEl) valueEl.textContent = def.label;

  const nicknameEl = document.getElementById('plan-badge-nickname');
  const account = getAccount();
  if (nicknameEl) {
    if (account?.nickname) {
      nicknameEl.textContent = account.nickname;
      nicknameEl.hidden = false;
    } else {
      nicknameEl.textContent = '';
      nicknameEl.hidden = true;
    }
  }
}

function initPlanModal() {
  const modal = document.getElementById('plan-modal');
  if (!modal) return;

  modal.querySelector('#plan-modal-close')?.addEventListener('click', closePlanModal);
  modal.querySelectorAll('[data-modal-close]').forEach(el => {
    el.addEventListener('click', closePlanModal);
  });
  modal.querySelectorAll('[data-plan-select]').forEach(btn => {
    btn.addEventListener('click', () => {
      const planId = btn.dataset.planSelect;
      handlePlanSelect(planId);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closePlanModal();
  });
}

function openPlanModal(highlightPlan) {
  const modal = document.getElementById('plan-modal');
  if (!modal) return;
  syncPlanModalState(highlightPlan);
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePlanModal() {
  const modal = document.getElementById('plan-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function syncPlanModalState(highlightPlan) {
  const current = getPlan();
  document.querySelectorAll('.plan-card').forEach(card => {
    const planId = card.dataset.plan;
    card.classList.toggle('is-current', planId === current);
    if (highlightPlan && planId === highlightPlan) {
      card.classList.add('plan-card--highlight');
    } else {
      card.classList.remove('plan-card--highlight');
    }
    const btn = card.querySelector('[data-plan-select]');
    if (!btn) return;
    if (planId === current) {
      btn.classList.add('is-current');
      btn.textContent = '現在のプラン';
      btn.disabled = true;
    } else {
      btn.classList.remove('is-current');
      btn.disabled = false;
      const labels = {
        free: '無料に戻す',
        shot: '本日のフル鑑定',
        basic: '月間まで開く',
        premium: '年間まで開く'
      };
      btn.textContent = labels[planId];
    }
  });

  // アカウント情報表示
  const accountBox = document.getElementById('plan-modal-account');
  if (!accountBox) return;
  const account = getAccount();
  if (account) {
    accountBox.hidden = false;
    document.getElementById('plan-modal-account-name').textContent = account.nickname;
    document.getElementById('plan-modal-account-email').textContent = `(${account.email})`;
  } else {
    accountBox.hidden = true;
  }
}

function handlePlanSelect(planId) {
  // BASIC/PREMIUM は要ログイン
  if (PLANS_REQUIRING_LOGIN.has(planId) && !isLoggedIn()) {
    pendingPlanAfterAuth = planId;
    closePlanModal();
    openAuthModal({ targetPlan: planId });
    return;
  }
  applyPlanChange(planId);
  setTimeout(closePlanModal, 250);
}

function applyPlanChange(planId) {
  setPlan(planId);
  refreshPlanBadge();
  if (currentResult) applyPaywall();
  // PREMIUM になった瞬間にSync Log + Coach を初期化
  if (planId === 'premium' && currentResult) {
    ensureSeed({ pillarsData: currentResult.pillarsData });
    maybeRecordTodayInLog();
    maybeEnsureCoachPlan();
  }
  refreshSyncLogButton();
  refreshCoachButton();
  syncPlanModalState();
}

function maybeEnsureCoachPlan() {
  if (!currentResult) return;
  if (!canAccess('ai_dialogue')) return;
  getOrCreateThisMonthPlan({
    pillarsData: currentResult.pillarsData,
    hackData: currentResult.hackData,
    flowData: currentResult.flowData
  });
}

// ========================================
// Auth Modal
// ========================================
function initAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  modal.querySelector('#auth-modal-close')?.addEventListener('click', closeAuthModal);
  modal.querySelectorAll('[data-auth-close]').forEach(el => {
    el.addEventListener('click', closeAuthModal);
  });

  // タブ切り替え
  modal.querySelectorAll('[data-auth-tab]').forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab.dataset.authTab));
  });

  // 新規登録
  document.getElementById('auth-signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSignupSubmit();
  });

  // ログイン
  document.getElementById('auth-login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLoginSubmit();
  });

  // Esc で閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeAuthModal();
  });

  // ログアウトボタン
  document.getElementById('plan-modal-logout')?.addEventListener('click', handleLogout);
}

function openAuthModal({ targetPlan } = {}) {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  // フォームを初期化
  ['auth-signup-form', 'auth-login-form'].forEach(id => {
    const f = document.getElementById(id);
    if (f) f.reset();
  });
  hideAuthError('signup');
  hideAuthError('login');
  switchAuthTab('signup');

  const lead = document.getElementById('auth-modal-lead');
  if (lead && targetPlan) {
    const def = PLAN_DEFS[targetPlan];
    lead.innerHTML = `<strong>${def.label}（${def.priceLabel}${def.priceUnit || ''}）</strong>のご利用には<br>簡単なアカウント登録が必要です。`;
  } else if (lead) {
    lead.innerHTML = 'BASIC・PREMIUM プランをご利用には<br>簡単なアカウント登録が必要です。';
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('auth-nickname')?.focus(), 50);
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  pendingPlanAfterAuth = null;
}

function switchAuthTab(tab) {
  document.querySelectorAll('[data-auth-tab]').forEach(el => {
    el.classList.toggle('auth-tabs__tab--active', el.dataset.authTab === tab);
  });
  document.querySelectorAll('[data-auth-form]').forEach(form => {
    form.hidden = form.dataset.authForm !== tab;
  });
  hideAuthError('signup');
  hideAuthError('login');
}

function showAuthError(kind, message) {
  const el = document.getElementById(`auth-${kind}-error`);
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
}

function hideAuthError(kind) {
  const el = document.getElementById(`auth-${kind}-error`);
  if (!el) return;
  el.textContent = '';
  el.hidden = true;
}

function handleSignupSubmit() {
  const nickname = document.getElementById('auth-nickname').value;
  const email = document.getElementById('auth-signup-email').value;
  const result = signup({ nickname, email, plan: 'free' });
  if (!result.ok) {
    showAuthError('signup', result.error);
    return;
  }
  finalizeAuth();
}

function handleLoginSubmit() {
  const email = document.getElementById('auth-login-email').value;
  const result = login({ email });
  if (!result.ok) {
    showAuthError('login', result.error);
    return;
  }
  finalizeAuth();
}

function finalizeAuth() {
  const nextPlan = pendingPlanAfterAuth;
  pendingPlanAfterAuth = null;
  if (nextPlan) {
    applyPlanChange(nextPlan);
  } else {
    refreshPlanBadge();
    if (currentResult) applyPaywall();
  }
  closeAuthModal();
}

function handleLogout() {
  logout();
  refreshPlanBadge();
  if (currentResult) applyPaywall();
  syncPlanModalState();
}

// ========================================
// Sync Log (PREMIUM)
// ========================================
function refreshSyncLogButton() {
  const btn = document.getElementById('sync-log-btn');
  if (!btn) return;
  btn.hidden = !canAccess('sync_log');
}

function initSyncLogModal() {
  const btn = document.getElementById('sync-log-btn');
  btn?.addEventListener('click', openSyncLogModal);

  const modal = document.getElementById('synclog-modal');
  if (!modal) return;

  modal.querySelector('#synclog-modal-close')?.addEventListener('click', closeSyncLogModal);
  modal.querySelectorAll('[data-synclog-close]').forEach(el => {
    el.addEventListener('click', closeSyncLogModal);
  });
  modal.querySelector('#synclog-prev')?.addEventListener('click', () => shiftSyncLogMonth(-1));
  modal.querySelector('#synclog-next')?.addEventListener('click', () => shiftSyncLogMonth(1));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeSyncLogModal();
  });
}

function openSyncLogModal() {
  if (!canAccess('sync_log')) return;
  if (!syncLogMonthKey) syncLogMonthKey = monthKeyToday();
  const modal = document.getElementById('synclog-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderSyncLog();
}

function closeSyncLogModal() {
  const modal = document.getElementById('synclog-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function monthKeyToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function shiftSyncLogMonth(delta) {
  const [y, m] = syncLogMonthKey.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  const newKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  // 翌月は今月までしか見せない
  if (newKey > monthKeyToday()) return;
  syncLogMonthKey = newKey;
  renderSyncLog();
}

function renderSyncLog() {
  const monthEl = document.getElementById('synclog-current-month');
  const summaryEl = document.getElementById('synclog-summary');
  const entriesEl = document.getElementById('synclog-entries');
  if (!monthEl || !summaryEl || !entriesEl) return;

  const [y, m] = syncLogMonthKey.split('-').map(Number);
  monthEl.textContent = `${y}年 ${m}月`;

  // 翌月ボタンのdisable切替
  const nextBtn = document.getElementById('synclog-next');
  if (nextBtn) nextBtn.disabled = (syncLogMonthKey >= monthKeyToday());

  const summary = getMonthlySummary(syncLogMonthKey);
  const focusLabel = summary.topFocus ? FOCUS_LABELS[summary.topFocus] || summary.topFocus : '—';
  summaryEl.innerHTML = `
    <div class="synclog-summary__item">
      <span class="synclog-summary__label">記録</span>
      <span class="synclog-summary__value">${summary.recorded}/${summary.total}</span>
    </div>
    <div class="synclog-summary__item">
      <span class="synclog-summary__label">的中率</span>
      <span class="synclog-summary__value synclog-summary__value--accent">${summary.hitRate}%</span>
    </div>
    <div class="synclog-summary__item">
      <span class="synclog-summary__label">平均一致度</span>
      <span class="synclog-summary__value">${summary.avgRating || '—'}</span>
    </div>
    <div class="synclog-summary__item">
      <span class="synclog-summary__label">的中分野</span>
      <span class="synclog-summary__value" style="font-size:0.85rem;">${focusLabel}</span>
    </div>
  `;

  const entries = getMonthEntries(syncLogMonthKey);
  if (!entries.length) {
    entriesEl.innerHTML = '<div class="synclog-empty">この月のログはまだありません。</div>';
    return;
  }
  // 新しい日付が上に来るよう降順
  entries.reverse();
  entriesEl.innerHTML = entries.map(renderSyncLogEntry).join('');
  // 各エントリのフォームをバインド
  entriesEl.querySelectorAll('[data-synclog-entry]').forEach(form => {
    bindSyncLogEntryForm(form);
  });
}

function renderSyncLogEntry(entry) {
  const [y, m, d] = entry.date.split('-');
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][dt.getDay()];
  const focusLabel = FOCUS_LABELS[entry.focus] || entry.focus || '総合';
  const recorded = entry.actual && entry.rating;

  let bottom;
  if (recorded) {
    const stars = '★'.repeat(entry.rating) + '☆'.repeat(5 - entry.rating);
    bottom = `
      <div class="synclog-entry__actual">${escapeHtml(entry.actual)}</div>
      <div class="synclog-entry__rating">一致度: ${stars} (${entry.rating}/5)</div>
    `;
  } else {
    bottom = `
      <form class="synclog-entry__form" data-synclog-entry="${entry.date}">
        <textarea class="synclog-entry__textarea" name="actual" placeholder="この日の出来事を1行で..." maxlength="120" required></textarea>
        <div class="synclog-entry__rating-input">
          <span class="synclog-entry__rating-label">一致度:</span>
          ${[1,2,3,4,5].map(n => `<button type="button" class="synclog-entry__star" data-rating="${n}">☆</button>`).join('')}
          <button type="submit" class="synclog-entry__submit">記録する</button>
        </div>
      </form>
    `;
  }

  return `
    <article class="synclog-entry${recorded ? ' synclog-entry--recorded' : ''}">
      <div class="synclog-entry__date">
        ${Number(m)}/${Number(d)}
        <small>${dayOfWeek}曜日</small>
      </div>
      <div class="synclog-entry__body">
        <div class="synclog-entry__pred">
          <span class="synclog-entry__chip">${escapeHtml(entry.theme || '—')}</span>
          <span class="synclog-entry__chip">${focusLabel}</span>
          <span class="synclog-entry__score">スコア ${entry.score}</span>
          ${entry.shukuyo ? `<span class="synclog-entry__chip">宿: ${escapeHtml(entry.shukuyo)}</span>` : ''}
        </div>
        ${bottom}
      </div>
    </article>
  `;
}

function bindSyncLogEntryForm(form) {
  let selectedRating = 0;
  const stars = form.querySelectorAll('[data-rating]');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.rating, 10);
      stars.forEach(s => {
        const n = parseInt(s.dataset.rating, 10);
        s.classList.toggle('is-active', n <= selectedRating);
        s.textContent = n <= selectedRating ? '★' : '☆';
      });
    });
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = form.dataset.synclogEntry;
    const text = form.querySelector('[name="actual"]').value.trim();
    if (!text) return;
    if (!selectedRating) {
      alert('一致度を選択してください');
      return;
    }
    recordActual(date, text, selectedRating);
    renderSyncLog();
  });
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ========================================
// AI Coach (PREMIUM)
// ========================================
function refreshCoachButton() {
  const btn = document.getElementById('ai-coach-btn');
  if (!btn) return;
  btn.hidden = !canAccess('ai_dialogue');
}

function currentCoachMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function initCoachModal() {
  document.getElementById('ai-coach-btn')?.addEventListener('click', openCoachModal);

  const modal = document.getElementById('coach-modal');
  if (!modal) return;

  modal.querySelector('#coach-modal-close')?.addEventListener('click', closeCoachModal);
  modal.querySelectorAll('[data-coach-close]').forEach(el => {
    el.addEventListener('click', closeCoachModal);
  });
  document.getElementById('coach-dialogue-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    handleCoachSubmit();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeCoachModal();
  });
}

function openCoachModal() {
  if (!canAccess('ai_dialogue')) return;
  // 念のため: 当月プランがなければ生成
  if (currentResult) {
    ensureMonthPlan(currentCoachMonthKey(), {
      pillarsData: currentResult.pillarsData,
      hackData: currentResult.hackData,
      flowData: currentResult.flowData
    });
  }
  const modal = document.getElementById('coach-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderCoach();
}

function closeCoachModal() {
  const modal = document.getElementById('coach-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function renderCoach() {
  const monthKey = currentCoachMonthKey();
  const plan = getMonthPlan(monthKey);
  const themeEl = document.getElementById('coach-theme');
  const actionsEl = document.getElementById('coach-actions-list');
  const historyEl = document.getElementById('coach-dialogue-history');
  if (!themeEl || !actionsEl || !historyEl) return;

  if (!plan) {
    themeEl.innerHTML = '<p class="coach-empty">解析を実行すると、今月のテーマが生成されます。</p>';
    actionsEl.innerHTML = '';
    historyEl.innerHTML = '';
    return;
  }

  const [y, m] = monthKey.split('-').map(Number);
  themeEl.innerHTML = `
    <p class="coach-theme__month">${y}年 ${m}月のテーマ</p>
    <h3 class="coach-theme__title">${escapeHtml(plan.theme)}</h3>
    <p class="coach-theme__summary">${escapeHtml(plan.summary)}</p>
  `;

  actionsEl.innerHTML = plan.actions.map(a => `
    <div class="coach-action${a.status === 'done' ? ' coach-action--done' : ''}" data-action-id="${a.id}">
      <div class="coach-action__check"></div>
      <div class="coach-action__text">${escapeHtml(a.text)}</div>
    </div>
  `).join('');

  actionsEl.querySelectorAll('[data-action-id]').forEach(el => {
    el.addEventListener('click', () => {
      toggleAction(monthKey, el.dataset.actionId);
      renderCoach();
    });
  });

  if (!plan.dialogues.length) {
    historyEl.innerHTML = '<div class="coach-empty">まだ対話履歴はありません。今月の行動を一行入力してみてください。</div>';
  } else {
    // 新しい順で表示
    historyEl.innerHTML = [...plan.dialogues].reverse().map(d => {
      const dt = new Date(d.at);
      const stamp = `${dt.getMonth() + 1}/${dt.getDate()} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
      return `
        <div class="coach-dialogue__pair">
          <div class="coach-bubble coach-bubble--user">${escapeHtml(d.user)}<span class="coach-bubble__time">${stamp}</span></div>
          <div class="coach-bubble coach-bubble--ai">${escapeHtml(d.ai)}</div>
        </div>
      `;
    }).join('');
  }
}

function handleCoachSubmit() {
  const input = document.getElementById('coach-dialogue-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  const monthKey = currentCoachMonthKey();
  submitReflection(monthKey, text, currentResult ? {
    hackData: currentResult.hackData,
    flowData: currentResult.flowData
  } : {});
  input.value = '';
  renderCoach();
}

// --- Utility ---
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
