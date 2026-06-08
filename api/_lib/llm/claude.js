// Claude アダプタ — Messages API + tool use（構造化出力を強制）
// 入力 { system, user, schema, model } → 解釈JSON {summary, score?, sections}

import { fetchWithTimeout, MAX_OUTPUT_TOKENS } from '../http.js';

export async function callClaude({ system, user, schema, model }) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');

  const tool = {
    name: 'emit_fortune',
    description: '占い鑑定結果を指定スキーマの構造化データで返す',
    input_schema: schema
  };

  const res = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_OUTPUT_TOKENS,
      temperature: 0.7,
      system,
      messages: [{ role: 'user', content: user }],
      tools: [tool],
      tool_choice: { type: 'tool', name: 'emit_fortune' }
    })
  });

  if (!res.ok) throw new Error(`Claude ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const block = (data.content || []).find(b => b.type === 'tool_use');
  if (!block) throw new Error('Claude: no tool_use block');
  return block.input;
}
