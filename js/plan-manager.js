// ========================================
// Plan Manager - localStorage-backed plan state
// ES Module - plan-manager.js
//
// プラン: free / shot / basic / premium
// SHOT は当日のみ有効（日付キーで失効判定）
//
// ログイン中: アカウントの plan を真とする（account.js）
// 未ログイン: localStorage `celestia.plan` を使う
// ========================================

import { getAccount, updateAccount } from './account.js';

const STORAGE_KEY = 'celestia.plan';

export const PLAN_DEFS = {
  free:    { id: 'free',    label: 'FREE',    price: 0,   priceLabel: '無料',     rank: 0 },
  shot:    { id: 'shot',    label: 'SHOT',    price: 100, priceLabel: '¥100',    rank: 1 },
  basic:   { id: 'basic',   label: 'BASIC',   price: 300, priceLabel: '¥300/月', rank: 2 },
  premium: { id: 'premium', label: 'PREMIUM', price: 500, priceLabel: '¥500/月', rank: 3 }
};

// 機能 → 必要プラン rank
const FEATURE_REQUIREMENTS = {
  'today.simple':  0, // FREE: HACK簡易版（スコア+最適時間+一言）
  'core.summary':  0, // FREE: CORE総合分析+五行+ナクシャトラ概要
  'core.detail':   1, // SHOT+: 仕事/対人/財運/健康+強み弱み
  'hack.full':     1, // SHOT+: 時間帯チャート+TODO+軍師詳細
  'flow.monthly':  2, // BASIC+: 当月+前後の月間カレンダー
  'flow.yearly':   3, // PREMIUM: 年間カレンダー(複数年)+大運+天中殺
  'sync_log':      3, // PREMIUM: 運気ログ
  'ai_dialogue':   3  // PREMIUM: AI対話タスク管理
};

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function readGuestState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { plan: 'free' };
    const parsed = JSON.parse(raw);
    if (parsed.plan === 'shot' && parsed.shotDate !== todayKey()) {
      return { plan: 'free' };
    }
    return parsed;
  } catch {
    return { plan: 'free' };
  }
}

function writeGuestState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage 利用不可は黙殺
  }
}

export function getPlan() {
  const account = getAccount();
  if (account) {
    if (account.plan === 'shot' && account.shotDate !== todayKey()) return 'free';
    return account.plan || 'free';
  }
  return readGuestState().plan;
}

export function setPlan(planId) {
  if (!PLAN_DEFS[planId]) return;
  const account = getAccount();
  if (account) {
    const patch = { plan: planId };
    patch.shotDate = planId === 'shot' ? todayKey() : null;
    updateAccount(patch);
    return;
  }
  const state = { plan: planId };
  if (planId === 'shot') state.shotDate = todayKey();
  writeGuestState(state);
}

export function canAccess(feature) {
  const required = FEATURE_REQUIREMENTS[feature];
  if (required === undefined) return true;
  const currentRank = PLAN_DEFS[getPlan()].rank;
  return currentRank >= required;
}

// ある機能をアンロックするのに必要な最小プランIDを返す
export function minPlanFor(feature) {
  const required = FEATURE_REQUIREMENTS[feature] ?? 0;
  return Object.values(PLAN_DEFS).find(p => p.rank === required)?.id ?? 'free';
}
