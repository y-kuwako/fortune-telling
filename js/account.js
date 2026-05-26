// ========================================
// Account Manager - localStorage-backed account state
// ES Module - account.js
//
// MVP: ニックネーム + メール のみ。パスワードなし。
// 同一ブラウザ内のみ有効（後でSupabase等に差し替え予定）。
//
// データ構造:
//   accounts:  { [email]: { nickname, email, plan, createdAt, lastLogin } }
//   session:   { email } | null
// ========================================

const KEY_ACCOUNTS = 'celestia.accounts';
const KEY_SESSION = 'celestia.session';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage 利用不可
  }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeNickname(nickname) {
  return String(nickname || '').trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isLoggedIn() {
  return !!getSession();
}

export function getSession() {
  return readJson(KEY_SESSION, null);
}

export function getAccount() {
  const session = getSession();
  if (!session) return null;
  const accounts = readJson(KEY_ACCOUNTS, {});
  return accounts[session.email] || null;
}

/**
 * 新規登録。メール重複は失敗。
 * @returns {{ok: true, account} | {ok: false, error: string}}
 */
export function signup({ nickname, email, plan = 'free' }) {
  const nick = normalizeNickname(nickname);
  const mail = normalizeEmail(email);

  if (!nick) return { ok: false, error: 'ニックネームを入力してください' };
  if (nick.length > 20) return { ok: false, error: 'ニックネームは20文字以内で入力してください' };
  if (!isValidEmail(mail)) return { ok: false, error: 'メールアドレスの形式が正しくありません' };

  const accounts = readJson(KEY_ACCOUNTS, {});
  if (accounts[mail]) {
    return { ok: false, error: 'このメールアドレスは既に登録されています。ログインをお試しください' };
  }

  const now = new Date().toISOString();
  const account = { nickname: nick, email: mail, plan, createdAt: now, lastLogin: now };
  accounts[mail] = account;
  writeJson(KEY_ACCOUNTS, accounts);
  writeJson(KEY_SESSION, { email: mail });
  return { ok: true, account };
}

/**
 * ログイン（MVPはメールのみで認証）。
 * @returns {{ok: true, account} | {ok: false, error: string}}
 */
export function login({ email }) {
  const mail = normalizeEmail(email);
  if (!isValidEmail(mail)) return { ok: false, error: 'メールアドレスの形式が正しくありません' };

  const accounts = readJson(KEY_ACCOUNTS, {});
  const account = accounts[mail];
  if (!account) {
    return { ok: false, error: 'このメールアドレスはまだ登録されていません。新規登録をお試しください' };
  }
  account.lastLogin = new Date().toISOString();
  accounts[mail] = account;
  writeJson(KEY_ACCOUNTS, accounts);
  writeJson(KEY_SESSION, { email: mail });
  return { ok: true, account };
}

export function logout() {
  try {
    localStorage.removeItem(KEY_SESSION);
  } catch {
    // 無視
  }
}

/**
 * 現在ログイン中アカウントの一部をパッチ更新する。
 */
export function updateAccount(patch) {
  const session = getSession();
  if (!session) return null;
  const accounts = readJson(KEY_ACCOUNTS, {});
  const current = accounts[session.email];
  if (!current) return null;
  const next = { ...current, ...patch };
  accounts[session.email] = next;
  writeJson(KEY_ACCOUNTS, accounts);
  return next;
}
