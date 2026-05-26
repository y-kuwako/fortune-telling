// ========================================
// Sync Log - PREMIUMの「運気ログ」データストア
// ES Module - sync-log.js
//
// 役割:
//   - 日々の AI予測（スコア / テーマ / 宿曜 / 主分野）を蓄積
//   - ユーザーが記入する「実際の出来事」と一致度評価を保持
//   - 月次サマリ（一致率・よく当たった分野）を計算
//   - PREMIUM加入時に過去30日分のシードを生成
//
// データ:
//   localStorage `celestia.syncLog.${email}` =
//     { entries: { 'yyyy-mm-dd': Entry }, seeded: boolean }
//   Entry: { date, score, theme, shukuyo, focus, actual, rating, recordedAt }
// ========================================

import { getAccount } from './account.js';

function storageKey(email) {
  return `celestia.syncLog.${email}`;
}

function readLog(email) {
  try {
    const raw = localStorage.getItem(storageKey(email));
    if (!raw) return { entries: {}, seeded: false };
    const parsed = JSON.parse(raw);
    return { entries: parsed.entries || {}, seeded: !!parsed.seeded };
  } catch {
    return { entries: {}, seeded: false };
  }
}

function writeLog(email, log) {
  try {
    localStorage.setItem(storageKey(email), JSON.stringify(log));
  } catch {
    // 無視
  }
}

function dateKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function monthKeyOf(dateStr) {
  return dateStr.slice(0, 7); // 'yyyy-mm'
}

function currentEmail() {
  const acc = getAccount();
  return acc?.email || null;
}

// ========================================
// 予測のテーマ・主分野を簡易に決める（HACKデータから）
// ========================================
function deriveForecast(score, hourlyOptimization) {
  if (!hourlyOptimization?.length) {
    return { theme: '平穏', focus: 'overall' };
  }
  // 最も高い指標を特定
  const totals = { concentration: 0, social: 0, creativity: 0 };
  hourlyOptimization.forEach(s => {
    totals.concentration += s.concentration;
    totals.social += s.social;
    totals.creativity += s.creativity;
  });
  const winner = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
  const themeMap = {
    concentration: '集中力UP',
    social: '対人運UP',
    creativity: '創造力UP'
  };
  const focusMap = {
    concentration: 'work',
    social: 'social',
    creativity: 'creative'
  };
  let theme = themeMap[winner] || '平穏';
  if (score < 50) theme = `${winner === 'concentration' ? '集中力' : winner === 'social' ? '対人運' : '創造力'}低下日`;
  return { theme, focus: focusMap[winner] || 'overall' };
}

// ========================================
// 予測エントリ（実績未記入）の作成
// ========================================
function buildPredictionEntry({ date, score, theme, shukuyo, focus }) {
  return {
    date,
    score,
    theme,
    shukuyo: shukuyo || null,
    focus: focus || 'overall',
    actual: null,
    rating: null,
    recordedAt: new Date().toISOString()
  };
}

// ========================================
// 公開API
// ========================================

/**
 * 今日の予測を保存（または更新）。すでに actual が記入されていれば上書きしない。
 */
export function recordTodayPrediction({ pillarsData, hackData, shukuyoData }) {
  const email = currentEmail();
  if (!email || !pillarsData || !hackData) return null;

  const today = new Date();
  const key = dateKey(today);
  const log = readLog(email);

  // 簡易スコア（HACK 総合）
  const score = hackData.scores?.overall ?? 50;
  const { theme, focus } = deriveForecast(score, hackData.hourlyOptimization);
  const shukuyo = shukuyoData?.todayShukuyo?.name || null;

  const existing = log.entries[key];
  if (existing && existing.actual) {
    // 既に実績記入済みは上書きしない
    return existing;
  }

  log.entries[key] = buildPredictionEntry({ date: key, score, theme, shukuyo, focus });
  writeLog(email, log);
  return log.entries[key];
}

/**
 * ユーザーが「実際の出来事」を記録。rating は 1-5。
 */
export function recordActual(dateStr, actualText, rating) {
  const email = currentEmail();
  if (!email) return null;
  const log = readLog(email);
  const entry = log.entries[dateStr];
  if (!entry) return null;
  entry.actual = String(actualText || '').trim();
  entry.rating = Math.max(1, Math.min(5, parseInt(rating, 10) || 0)) || null;
  entry.recordedAt = new Date().toISOString();
  log.entries[dateStr] = entry;
  writeLog(email, log);
  return entry;
}

/**
 * 月（'yyyy-mm'）のエントリ配列を日付昇順で返す。
 */
export function getMonthEntries(monthKey) {
  const email = currentEmail();
  if (!email) return [];
  const log = readLog(email);
  return Object.values(log.entries)
    .filter(e => monthKeyOf(e.date) === monthKey)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 月次サマリ: 記入率, 平均一致度, よく当たった分野
 */
export function getMonthlySummary(monthKey) {
  const entries = getMonthEntries(monthKey);
  const total = entries.length;
  if (!total) return { total: 0, recorded: 0, avgRating: 0, hitRate: 0, topFocus: null };
  const recorded = entries.filter(e => e.rating !== null && e.rating !== undefined);
  const avgRating = recorded.length
    ? recorded.reduce((s, e) => s + (e.rating || 0), 0) / recorded.length
    : 0;
  // 一致度4以上を"的中"と扱う
  const hits = recorded.filter(e => (e.rating || 0) >= 4);
  const hitRate = recorded.length ? hits.length / recorded.length : 0;
  // 的中したエントリの focus 集計
  const focusCount = {};
  hits.forEach(e => {
    focusCount[e.focus] = (focusCount[e.focus] || 0) + 1;
  });
  const topEntry = Object.entries(focusCount).sort((a, b) => b[1] - a[1])[0];
  return {
    total,
    recorded: recorded.length,
    avgRating: Math.round(avgRating * 10) / 10,
    hitRate: Math.round(hitRate * 100),
    topFocus: topEntry ? topEntry[0] : null
  };
}

/**
 * PREMIUM加入時のシード生成: 過去30日分の予測ログを「実績未記入」状態で作る。
 * 既にseed済みなら何もしない。
 */
export function ensureSeed({ pillarsData, getDailyForecast }) {
  const email = currentEmail();
  if (!email || !pillarsData) return false;
  const log = readLog(email);
  if (log.seeded) return false;

  const today = new Date();
  const stem = pillarsData.dayPillar?.stem?.element || '木';
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    if (log.entries[key]) continue;
    const seed = (d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()) + stem.charCodeAt(0);
    const x = Math.sin(seed) * 10000;
    const rand = x - Math.floor(x);
    const score = Math.floor(rand * 35) + 50;
    const themeOpts = ['対人運UP', '集中力UP', '創造力UP', '財運好調', '集中力低下日', '休息推奨'];
    const focusOpts = ['social', 'work', 'creative', 'money', 'work', 'rest'];
    const idx = Math.floor(rand * themeOpts.length);
    log.entries[key] = {
      date: key,
      score,
      theme: themeOpts[idx],
      shukuyo: null,
      focus: focusOpts[idx],
      actual: null,
      rating: null,
      recordedAt: new Date().toISOString()
    };
  }
  log.seeded = true;
  writeLog(email, log);
  return true;
}

export const FOCUS_LABELS = {
  overall: '総合',
  work: '仕事運',
  social: '対人運',
  creative: '創造力',
  money: '財運',
  rest: '休息'
};
