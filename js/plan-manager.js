// ========================================
// Plan Manager - localStorage-backed plan state
// ES Module - plan-manager.js
//
// 新仕様（3 ティア）:
//   FREE     ─ 0円        / Today's アドバイス（HACK: 宿曜 × 四柱推命）
//   BASIC    ─ ¥500/月    / + あなたの基本スペック（CORE: 四柱推命 × インド占星術）
//                          + This month's スケジュール（FLOW月間: 宿曜 × トランジット）
//   PREMIUM  ─ ¥19,800/年 / + This year's スケジュール（FLOW年間: ダシャー × 大運・歳運）
//
// 旧 `shot` ティアは廃止。localStorage に旧 shot が残っていれば free にマイグレート。
// ログイン中: アカウントの plan を真とする（account.js）
// 未ログイン: localStorage `celestia.plan` を使う
// ========================================

import { getAccount, updateAccount } from './account.js';

const STORAGE_KEY = 'celestia.plan';

export const PLAN_DEFS = {
  free: {
    id: 'free', rank: 0,
    label: 'FREE', codename: "TODAY'S ONLY",
    price: 0, priceLabel: '0円', priceUnit: '',
    timeHorizon: '今日',
    system: '宿曜占星術 × 四柱推命',
    logic: 'AIが「今日、何時に、何を実行すべきか」のTODOを提示',
    ux: "Today's アドバイス"
  },
  basic: {
    id: 'basic', rank: 1,
    label: 'BASIC', codename: '基本スペック + 月間',
    price: 500, priceLabel: '¥500', priceUnit: '/ 月',
    timeHorizon: '自分の核 + 今月',
    system: '四柱推命 × インド占星術 / 宿曜 × トランジット',
    logic: '「自分」というハードウェア解析 + 月間バイオリズムのハック',
    ux: "あなたの基本スペック + This month's スケジュール"
  },
  premium: {
    id: 'premium', rank: 2,
    label: 'PREMIUM', codename: 'PRO / YEARLY',
    price: 19800, priceLabel: '¥19,800', priceUnit: '/ 年',
    timeHorizon: '今年・数年先',
    system: 'インド占星術ダシャー × 四柱推命 大運・歳運',
    logic: '人生 10 倍拡張のロードマップを戦略レポート化',
    ux: "This year's スケジュール（数年分のお守り）"
  }
};

// 機能 → 必要プラン rank
const FEATURE_REQUIREMENTS = {
  // Today's アドバイス (HACK) — FREE で全公開
  'today.simple':  0,
  'hack.full':     0,
  // あなたの基本スペック (CORE) — BASIC 以上
  'core.summary':  1,
  'core.detail':   1,
  // This month's スケジュール (FLOW 月間) — BASIC 以上
  'flow.monthly':  1,
  // This year's スケジュール (FLOW 年間) — PREMIUM 限定
  'flow.yearly':   2,
  // 追加機能 — PREMIUM
  'sync_log':      2,
  'ai_dialogue':   2
};

// 旧 `shot` ID (廃止) を free にマイグレートする
function migrateLegacyPlan(planId) {
  if (planId === 'shot') return 'free';
  if (!planId || !PLAN_DEFS[planId]) return 'free';
  return planId;
}

function readGuestState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { plan: 'free' };
    const parsed = JSON.parse(raw);
    const migrated = migrateLegacyPlan(parsed.plan);
    return { plan: migrated };
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
  if (account) return migrateLegacyPlan(account.plan);
  return readGuestState().plan;
}

export function setPlan(planId) {
  const safeId = migrateLegacyPlan(planId);
  if (!PLAN_DEFS[safeId]) return;
  const account = getAccount();
  if (account) {
    // 旧 shotDate フィールドが残っていれば消去
    updateAccount({ plan: safeId, shotDate: null });
    return;
  }
  writeGuestState({ plan: safeId });
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
