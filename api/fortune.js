// ========================================
// Fortune API - Serverless Function
// Deploy to: Cloudflare Workers / Vercel Edge / etc.
// ========================================
//
// Environment Variables Required:
//   ANTHROPIC_API_KEY - Claude API key
//
// Endpoint: POST /api/fortune
// Body: { layer, birth, calculated }
// Returns: JSON fortune interpretation
//

const SYSTEM_PROMPT = `[ROLE]
あなたは天推 AI（テンスイ・アイ）のAI命術解析エンジンです。四柱推命（Four Pillars of Destiny）とインド占星術（Vedic Astrology）の二つの体系を統合し、「人生最適化」のための分析レポートを生成します。

あなたのトーンは分析的・戦略的です。占い師ではなく「解析エンジン」として振る舞ってください。
- テクノロジー、戦略、自然の比喩を使用
- 曖昧な表現や迷信的な言い回しは避ける
- 「〜かもしれません」ではなく「〜の傾向が強い」「〜が最適解」のような断定的な表現を使用
- すべての分析は命術データに基づく根拠を示すこと

[KNOWLEDGE BASE]
四柱推命の基礎:
- 天干（甲乙丙丁戊己庚辛壬癸）: 10の天のエネルギー
- 地支（子丑寅卯辰巳午未申酉戌亥）: 12の地のエネルギー
- 五行（木火土金水）: 相生（木→火→土→金→水→木）と相剋（木→土→水→火→金→木）
- 日干が命主の本質を表す最重要要素
- 通変星: 日干と他の天干の関係（比肩・劫財・食神・傷官・偏財・正財・偏官・正官・偏印・印綬）
- 空亡: その人の六十甲子グループで使われない地支2つ。注意すべきタイミング

インド占星術の基礎:
- ナクシャトラ（27宿）: 月の軌道を27分割した領域。個人の本質的性格を示す
- パダ（4分の1区分）: ナクシャトラ内の細分化。より詳細な性格特性を示す
- ラーシ（12星座）: サイデリアル方式（西洋占星術と約23度ずれる）
- ダシャー: 惑星期間システム。人生の大きな転換点を示す
- グナ（サットヴァ/ラジャス/タマス）: ナクシャトラの質的分類

[CROSS-SYSTEM SYNTHESIS RULES]
二つの体系を統合する際のルール:
1. 五行とヴェーダの惑星の対応: 木=木星、火=火星/太陽、土=土星、金=金星、水=水星/月
2. 天干の陰陽とグナの対応: 陽×サットヴァ=最も積極的、陰×タマス=最も内省的
3. 矛盾がある場合は「二つの体系が異なる角度を示している」として、両面を提示
4. 統合の優先順位: 日干の五行 > ナクシャトラの性質 > ダシャーの時期的影響

[OUTPUT FORMAT]
以下の正確なJSON形式で出力してください。JSONのみを返し、他のテキストは含めないでください:
{
  "title": "鑑定タイトル（10字以内、命式の本質を端的に）",
  "subtitle": "サブタイトル（20字以内、二体系の統合ポイント）",
  "overall": "総合分析（300-400字。命式全体の俯瞰。四柱推命とインド占星術の両方からの根拠を含める）",
  "strengths": ["強み1（具体的に）", "強み2", "強み3"],
  "weaknesses": ["注意点1（ポジティブな言い換え含む）", "注意点2"],
  "career": "仕事・キャリア分析（200-250字。適職の方向性と今の時期のアドバイス）",
  "love": "対人関係分析（200-250字。恋愛だけでなく、人間関係全般）",
  "money": "財運・資産分析（150-200字）",
  "health": "健康・エネルギー管理（150-200字。五行の臓器対応を活用）",
  "elementBalance": {"木": 0-100, "火": 0-100, "土": 0-100, "金": 0-100, "水": 0-100},
  "dailyAdvice": "今日のワンポイント（50字以内、具体的なアクション）"
}

[INCOMPLETE DATA HANDLING]
出生時刻が不明の場合:
- 「出生時刻不明のため、時柱を除いた分析です」と明記
- 年柱・月柱・日柱から読み取れる確実なパターンに集中
- ナクシャトラのパダは参考値として扱う
- 不明データに起因する不確実性は正直に伝えつつ、確実な部分の分析を充実させる

出生地が不明の場合:
- 真太陽時の補正なしで分析
- 地理的影響を除いた普遍的なパターンに焦点を当てる`;

/**
 * Build the user prompt from birth and calculated data.
 */
function buildUserPrompt(birth, calculated) {
  const hourInfo = birth.timeUnknown || !birth.hour
    ? "（出生時刻不明）"
    : `${birth.hour}時${birth.minute || 0}分`;

  const placeInfo = birth.placeUnknown || !birth.place
    ? "（出生地不明）"
    : birth.place;

  return `以下の命術データに基づき、CORE層の鑑定を生成してください。

【生年月日】${birth.year}年${birth.month}月${birth.day}日 ${hourInfo}
【出生地】${placeInfo}
【性別】${birth.gender || "未指定"}

【四柱推命データ】
- 年柱: ${calculated.yearPillar}
- 月柱: ${calculated.monthPillar}
- 日柱: ${calculated.dayPillar}
- 時柱: ${calculated.hourPillar || "不明（出生時刻なし）"}
- 日干: ${calculated.dayStem}（${calculated.dayStemElement}・${calculated.dayStemYinYang}）
- 五行分布: 木${calculated.elementBalance["木"]}% 火${calculated.elementBalance["火"]}% 土${calculated.elementBalance["土"]}% 金${calculated.elementBalance["金"]}% 水${calculated.elementBalance["水"]}%
- 通変星: ${JSON.stringify(calculated.tenGods)}
- 空亡: ${calculated.kuubou.join("・")}

【インド占星術データ】
- ナクシャトラ: ${calculated.nakshatra}（${calculated.nakshatraDeity}の守護）
- 特性: ${calculated.nakshatraTrait}
- 品質: ${calculated.nakshatraQuality}
- パダ: 第${calculated.pada}パダ
- ラーシ: ${calculated.rashi}（${calculated.rashiName}）
- ダシャー: ${calculated.dasha.ruler}期（${calculated.dasha.period}、残り${calculated.dasha.remaining}年）`;
}

/**
 * Main handler for the fortune API endpoint.
 * Adapt this for your serverless platform.
 */
async function handleFortuneRequest(request) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { layer, birth, calculated } = await request.json();

    if (!birth || !calculated) {
      return new Response(JSON.stringify({ error: 'Missing birth or calculated data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const userPrompt = buildUserPrompt(birth, calculated);

    // Call Claude API
    const apiKey = typeof ANTHROPIC_API_KEY !== 'undefined'
      ? ANTHROPIC_API_KEY
      : (typeof process !== 'undefined' ? process.env.ANTHROPIC_API_KEY : null);

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Claude API error:', errorText);
      return new Response(JSON.stringify({ error: 'AI analysis failed' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const claudeData = await claudeResponse.json();
    const content = claudeData.content?.[0]?.text;

    if (!content) {
      return new Response(JSON.stringify({ error: 'Empty AI response' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse JSON from Claude's response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: 'Invalid AI response format' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const fortuneData = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(fortuneData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Fortune API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// --- Cloudflare Workers export ---
// Uncomment for Cloudflare Workers deployment:
// export default {
//   async fetch(request, env) {
//     globalThis.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;
//     const url = new URL(request.url);
//     if (url.pathname === '/api/fortune') {
//       return handleFortuneRequest(request);
//     }
//     return new Response('Not found', { status: 404 });
//   }
// };

// --- Vercel Edge Function export ---
// Uncomment for Vercel Edge deployment:
// export const config = { runtime: 'edge' };
// export default handleFortuneRequest;

// --- Node.js / Express export ---
// For local development or Express-based deployment:
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { handleFortuneRequest, buildUserPrompt, SYSTEM_PROMPT };
}
