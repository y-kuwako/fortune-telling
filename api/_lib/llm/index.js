// callLLM — プロバイダ抽象化のディスパッチャ
// env LLM_PROVIDER で gemini / openai / claude を切替。
// 呼び出し側（/api/fortune）はプロバイダ差を一切意識しない。

import { callGemini } from './gemini.js';
import { callOpenAI } from './openai.js';
import { callClaude } from './claude.js';
import { RESPONSE_SCHEMA, pickModel } from '../prompt.js';

export async function callLLM({ system, user, tier }) {
  const provider = (process.env.LLM_PROVIDER || 'gemini').toLowerCase();
  const model = pickModel(provider, tier);
  const args = { system, user, schema: RESPONSE_SCHEMA, model };

  let parsed;
  switch (provider) {
    case 'openai':
      parsed = await callOpenAI(args);
      break;
    case 'claude':
    case 'anthropic':
      parsed = await callClaude(args);
      break;
    case 'gemini':
    default:
      parsed = await callGemini(args);
      break;
  }

  // どのプロバイダでも同じ形に整えて返す
  return {
    summary: parsed.summary || '',
    score: typeof parsed.score === 'number' ? parsed.score : null,
    sections: Array.isArray(parsed.sections) ? parsed.sections : [],
    meta: { provider, model }
  };
}
