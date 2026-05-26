// ========================================
// AI Coach - PREMIUMの月次タスク管理 / AI対話
// ES Module - ai-coach.js
//
// 機能:
//   - 月次テーマ＋推奨アクション3つを生成
//   - アクションのチェック切替
//   - ユーザーの振り返り入力 → AI（フォールバック）応答
//   - 月次の対話履歴を保存
//
// データ:
//   localStorage `celestia.aiPlan.${email}` =
//     { months: { 'yyyy-mm': MonthPlan } }
//   MonthPlan: { theme, summary, actions: Action[], dialogues: Dialogue[], generatedAt }
//   Action: { id, text, status: 'todo'|'done', doneAt }
//   Dialogue: { at, user, ai }
// ========================================

import { getAccount } from './account.js';

function storageKey(email) {
  return `celestia.aiPlan.${email}`;
}

function readPlan(email) {
  try {
    const raw = localStorage.getItem(storageKey(email));
    if (!raw) return { months: {} };
    return JSON.parse(raw) || { months: {} };
  } catch {
    return { months: {} };
  }
}

function writePlan(email, plan) {
  try {
    localStorage.setItem(storageKey(email), JSON.stringify(plan));
  } catch {
    // 無視
  }
}

function currentEmail() {
  return getAccount()?.email || null;
}

function thisMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ========================================
// テーマ判定: CORE/FLOW/HACK から当月の方向性を決める
// ========================================
const THEME_BANK = {
  social: {
    title: '人脈拡大期',
    summary: '対人運が動く月。新しい繋がりが、運勢の伸びしろを大きく広げます。',
    actions: [
      '業界イベントや勉強会に1回は顔を出す',
      '名刺をもらった人には48時間以内にお礼メッセージ',
      '今月、いつもより1人多く食事に誘ってみる'
    ]
  },
  work: {
    title: '集中力ピーク月',
    summary: '思考力と判断力が冴える月。重要案件を一気に進めましょう。',
    actions: [
      '今月最重要の意思決定を月の前半に集中させる',
      '午前の高集中時間を「邪魔されないブロック」として確保',
      '月末までに、ずっと先送りしていた1案件を完了させる'
    ]
  },
  creative: {
    title: '創造力の発露月',
    summary: '直感とアイデアが動く月。アウトプット起点で動くと運勢が伸びます。',
    actions: [
      '思いつきメモを毎日1個、テキストでも音声でも残す',
      '月内に「未公開の何か」を1つ世に出す（投稿/共有/提出）',
      '苦手分野の本やメディアにあえて触れて新しい刺激を入れる'
    ]
  },
  money: {
    title: '財運の好機月',
    summary: 'お金の流れが動く月。守りと攻めのバランスが鍵。',
    actions: [
      '今月の固定費を一度すべて棚卸しする',
      '副収入や還元の仕組みを1つ動かす（投資/特典/節税）',
      '月末に収支を振り返り、翌月の資金配分を決める'
    ]
  },
  rest: {
    title: '内省と整理の月',
    summary: '攻めるよりも整える月。今の地盤を固める判断が、来月以降の伸びを生みます。',
    actions: [
      '部屋・PC・スマホの3箇所を物理的に整理する',
      '人付き合いを意識的に絞り、回復時間を確保',
      '今月中に「やらないこと」を3つ決めてリスト化'
    ]
  },
  overall: {
    title: '基盤を磨く月',
    summary: '飛び抜けた波はないものの、地味な積み上げが効く月。',
    actions: [
      '毎日10分の同じ習慣を月末まで続ける',
      '今月3回、いつもの自分なら断っていたことを引き受ける',
      '月末に「自分が変わった点」を1行で記録する'
    ]
  }
};

function detectTheme({ pillarsData, hackData, flowData }) {
  // HACKのhourlyOptimizationから最も高い分野を取る
  if (hackData?.hourlyOptimization?.length) {
    const totals = { concentration: 0, social: 0, creativity: 0 };
    hackData.hourlyOptimization.forEach(s => {
      totals.concentration += s.concentration;
      totals.social += s.social;
      totals.creativity += s.creativity;
    });
    const overall = hackData.scores?.overall ?? 50;
    if (overall < 45) return 'rest';
    const winner = Object.entries(totals).sort((a, b) => b[1] - a[1])[0][0];
    if (winner === 'concentration') return 'work';
    if (winner === 'social') return 'social';
    if (winner === 'creativity') return 'creative';
  }
  // フォールバック: dominantElement で粗くマッピング
  const map = { '木': 'creative', '火': 'social', '土': 'overall', '金': 'money', '水': 'rest' };
  return map[pillarsData?.dominantElement] || 'overall';
}

function genActionId() {
  return `act-${Math.random().toString(36).slice(2, 9)}`;
}

// ========================================
// 公開API
// ========================================

export function getMonthPlan(monthKey) {
  const email = currentEmail();
  if (!email) return null;
  const plan = readPlan(email);
  return plan.months[monthKey] || null;
}

/**
 * その月のプランがなければ生成。既にあるなら何もしない。
 */
export function ensureMonthPlan(monthKey, context) {
  const email = currentEmail();
  if (!email) return null;
  const plan = readPlan(email);
  if (plan.months[monthKey]) return plan.months[monthKey];

  const focus = detectTheme(context || {});
  const bank = THEME_BANK[focus] || THEME_BANK.overall;
  const monthPlan = {
    theme: bank.title,
    focus,
    summary: bank.summary,
    actions: bank.actions.map(text => ({ id: genActionId(), text, status: 'todo', doneAt: null })),
    dialogues: [],
    generatedAt: new Date().toISOString()
  };
  plan.months[monthKey] = monthPlan;
  writePlan(email, plan);
  return monthPlan;
}

/**
 * 当月のプランを返す（なければ生成）。
 */
export function getOrCreateThisMonthPlan(context) {
  return ensureMonthPlan(thisMonthKey(), context);
}

export function toggleAction(monthKey, actionId) {
  const email = currentEmail();
  if (!email) return null;
  const plan = readPlan(email);
  const m = plan.months[monthKey];
  if (!m) return null;
  const act = m.actions.find(a => a.id === actionId);
  if (!act) return null;
  if (act.status === 'done') {
    act.status = 'todo';
    act.doneAt = null;
  } else {
    act.status = 'done';
    act.doneAt = new Date().toISOString();
  }
  writePlan(email, plan);
  return act;
}

/**
 * ユーザーの振り返り入力に対してAI（フォールバック）応答を生成して保存。
 */
export function submitReflection(monthKey, userText, context) {
  const email = currentEmail();
  if (!email) return null;
  const plan = readPlan(email);
  const m = plan.months[monthKey];
  if (!m) return null;
  const text = String(userText || '').trim();
  if (!text) return null;
  const ai = generateAiResponse(m, text, context);
  m.dialogues.push({ at: new Date().toISOString(), user: text, ai });
  writePlan(email, plan);
  return m;
}

/**
 * フォールバックのAI応答ロジック（後でClaude APIに差し替え可能）。
 */
function generateAiResponse(monthPlan, userText, context) {
  const remaining = monthPlan.actions.filter(a => a.status === 'todo');
  const done = monthPlan.actions.filter(a => a.status === 'done');
  const overall = context?.hackData?.scores?.overall ?? null;

  const intros = [
    'すばらしい一歩ですね。',
    'いい流れに乗っています。',
    '行動の質が運勢を動かしています。',
    '小さくても、確実に積み上がっています。'
  ];
  const intro = intros[Math.floor(Math.random() * intros.length)];

  let body;
  if (remaining.length > 0) {
    const next = remaining[0];
    body = `次の一手として、もう一段「${next.text}」を試してみてください。`;
    if (overall !== null && overall >= 60) {
      body += `今月のエネルギー値（${overall}%）は十分に高いので、今動くほど後半の伸びが大きくなります。`;
    } else if (overall !== null) {
      body += `今月のエネルギー値（${overall}%）は中程度。無理せず1つに絞って取り組むのが吉です。`;
    }
  } else if (done.length > 0) {
    body = `推奨アクションをすべて完了しています。月の残り日数で、今月のテーマ「${monthPlan.theme}」を一段深掘る自由行動を選んでみてください。`;
  } else {
    body = `まずは推奨アクションのうち、最も気軽に始められそうなものから試してみてください。`;
  }

  const closing = [
    '記録を続けるほど、AIはあなた専用に賢くなっていきます。',
    'この行動が来月の運勢シナリオにも影響してきます。',
    'あなたの「やった/やらなかった」をAIは一緒に見ています。'
  ];
  const close = closing[Math.floor(Math.random() * closing.length)];

  return `${intro}「${truncate(userText, 40)}」という行動はテーマ「${monthPlan.theme}」と整合しています。${body}\n\n${close}`;
}

function truncate(s, n) {
  const str = String(s || '');
  return str.length > n ? str.slice(0, n) + '…' : str;
}
