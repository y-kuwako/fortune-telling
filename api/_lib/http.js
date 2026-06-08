// タイムアウト付き fetch（プロバイダのハング対策）
// 既定12秒で AbortError を投げる → 呼び出し側で 502 になり、クライアントはテンプレへフォールバック。

export async function fetchWithTimeout(url, options, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// LLM の最大出力トークン（コスト上限。鑑定文には十分な値）
export const MAX_OUTPUT_TOKENS = 1500;
