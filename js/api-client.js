// ========================================
// API Client - Fortune API Communication
// ES Module - api-client.js
// ========================================

// API endpoint (configure for your deployment)
const API_BASE_URL = '/api';
const API_TIMEOUT_MS = 15000;

/**
 * Fetch fortune interpretation from the AI backend.
 * Returns null if the API is unavailable (triggers fallback).
 */
export async function fetchFortuneFromAPI(birthData, pillarsData, vedicData) {
  const endpoint = `${API_BASE_URL}/fortune`;

  const payload = {
    layer: 'core',
    birth: {
      year: birthData.year,
      month: birthData.month,
      day: birthData.day,
      hour: birthData.hour,
      place: birthData.place,
      gender: birthData.gender,
      timeUnknown: birthData.timeUnknown,
      placeUnknown: birthData.placeUnknown
    },
    calculated: {
      yearPillar: pillarsData.yearPillar.label,
      monthPillar: pillarsData.monthPillar.label,
      dayPillar: pillarsData.dayPillar.label,
      hourPillar: pillarsData.hourPillar?.label || null,
      dominantElement: pillarsData.dominantElement,
      elementBalance: pillarsData.elementBalance,
      dayStem: pillarsData.dayStem.name,
      dayStemElement: pillarsData.dayStem.element,
      dayStemYinYang: pillarsData.dayStem.yin_yang,
      tenGods: pillarsData.tenGods,
      kuubou: pillarsData.kuubou.map(k => k.name),
      nakshatra: vedicData.nakshatra.name,
      nakshatraDeity: vedicData.nakshatra.deity,
      nakshatraTrait: vedicData.nakshatra.trait,
      nakshatraQuality: vedicData.nakshatra.quality,
      pada: vedicData.pada,
      rashi: vedicData.rashi.jaName,
      rashiName: vedicData.rashi.name,
      dasha: {
        ruler: vedicData.dasha.ruler,
        period: vedicData.dasha.period,
        remaining: vedicData.dasha.remaining
      }
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`API returned ${response.status}`);
      return null;
    }

    const data = await response.json();
    return validateAndNormalizeResponse(data);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.warn('API request timed out');
    }
    return null;
  }
}

/**
 * Validate the API response has all required fields.
 */
function validateAndNormalizeResponse(data) {
  const required = ['title', 'subtitle', 'overall', 'career', 'love', 'money', 'health'];
  for (const field of required) {
    if (!data[field] || typeof data[field] !== 'string') {
      console.warn(`API response missing required field: ${field}`);
      return null;
    }
  }

  return {
    title: data.title,
    subtitle: data.subtitle,
    overall: data.overall,
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
    career: data.career,
    love: data.love,
    money: data.money,
    health: data.health,
    elementBalance: data.elementBalance || null,
    dailyAdvice: data.dailyAdvice || null,
    isLocalFallback: false
  };
}
