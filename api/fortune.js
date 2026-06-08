// ======================================================
// /api/fortune — 占い解釈生成エンドポイント（サーバーレス関数）
// Vercel Node Functions 形式（export default handler(req, res)）
//
// 役割:
//   1. リクエスト検証（layer/tier の妥当性・ペイロードサイズ上限）
//   2. システム/ユーザープロンプト構築
//   3. callLLM() で LLM を呼ぶ（プロバイダは env で切替・タイムアウト付き）
//   4. 構造化された鑑定JSONを返す
// 入力不正は 400、LLM失敗は 502 を返す。クライアントは null 時に既存テンプレへフォールバック。
//
// 必要な env: LLM_PROVIDER と対応する *_API_KEY（.env.example 参照）
// ======================================================

import { callLLM } from './_lib/llm/index.js';
import { buildSystemPrompt, buildUserPrompt } from './_lib/prompt.js';

const VALID_LAYERS = new Set(['hack', 'core', 'flow_month', 'flow_year']);
const VALID_TIERS  = new Set(['free', 'shot', 'basic', 'premium']);
const MAX_CALCULATED_BYTES = 8000; // 計算結果JSONの上限（肥大ペイロード・乱用防止）
const MAX_PROFILE_BYTES    = 2000;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // --- 1. 入力の取り出し・検証（不正は 400） ---
  let layer, tier, date, profile, calculated;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    ({ layer, tier = 'free', date, profile = {}, calculated = {} } = body);
  } catch (e) {
    return res.status(400).json({ error: 'invalid JSON body' });
  }

  if (!VALID_LAYERS.has(layer)) {
    return res.status(400).json({ error: 'invalid or missing layer' });
  }
  if (!VALID_TIERS.has(tier)) tier = 'free';
  if (!calculated || typeof calculated !== 'object') {
    return res.status(400).json({ error: 'calculated is required' });
  }
  if (JSON.stringify(calculated).length > MAX_CALCULATED_BYTES) {
    return res.status(400).json({ error: 'calculated too large' });
  }
  if (profile && JSON.stringify(profile).length > MAX_PROFILE_BYTES) {
    return res.status(400).json({ error: 'profile too large' });
  }

  // --- 2-4. プロンプト構築 → LLM 呼び出し（失敗は 502） ---
  try {
    const system = buildSystemPrompt();
    const user = buildUserPrompt({ layer, tier, date, profile, calculated });
    const result = await callLLM({ system, user, tier });
    // TODO: サーバーKVで hash(layer+tier+date+calculated) をキーに横断キャッシュ
    return res.status(200).json(result);
  } catch (e) {
    console.error('[api/fortune] LLM failed:', e);
    return res.status(502).json({ error: 'LLM_FAILED', detail: String((e && e.message) || e) });
  }
}
