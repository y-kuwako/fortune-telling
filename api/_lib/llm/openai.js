// OpenAI アダプタ — chat.completions + JSONモード
// 入力 { system, user, model } → 解釈JSON {summary, score?, sections}
// （JSON構造はシステムプロンプトで厳密に指定済み。json_object モードで妥当性を担保）

import { fetchWithTimeout, MAX_OUTPUT_TOKENS } from '../http.js';

export async function callOpenAI({ system, user, model }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');

  const res = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: MAX_OUTPUT_TOKENS,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });

  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenAI: empty response');
  return JSON.parse(text);
}
