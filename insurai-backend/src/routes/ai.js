import express from 'express';

const router = express.Router();

router.post('/policy-recommendation', async (req, res) => {
  const { holder, type, premium, coverage, status } = req.body || {};
  if (!holder || !type) {
    return res.status(400).json({ error: 'holder and type are required' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const fallbackResponse = () => {
    const premiumNum = Number(String(premium || '').replace(/[^0-9.]/g, '')) || 0;
    const coverageNum = Number(String(coverage || '').replace(/[^0-9.]/g, '')) || 0;
    let base = 4.5;
    if (type === 'Auto Insurance') base += 1.0;
    if (type === 'Property Insurance') base += 1.3;
    if (type === 'Life Insurance') base -= 0.4;
    if (type === 'Health Insurance') base += 0.2;
    if (coverageNum > 500000) base += 1.2;
    if (coverageNum > 1000000) base += 1.8;
    if (premiumNum > 1000) base -= 0.3;
    const score = Math.max(1, Math.min(9.8, Number(base.toFixed(1))));
    let rec = 'Standard';
    if (score <= 3) rec = 'Preferred';
    else if (score <= 5) rec = 'Standard';
    else if (score <= 7) rec = 'Review Required';
    else rec = 'High Risk';
    return {
      riskScore: `${score}/10`,
      aiRecommendation: rec,
      rationale: 'Fallback analysis generated locally (AI quota unavailable).'
    };
  };

  if (!apiKey) {
    return res.json(fallbackResponse());
  }

  const model = process.env.OPENAI_MODEL || 'gpt-5.4';
  const system = 'You are an insurance risk analyst. Return JSON only.';
  const user = `
Analyze this policy and produce a risk score and AI recommendation.
Return a JSON object with:
- riskScore (string, format "x.y/10")
- aiRecommendation (string, one of "Preferred", "Standard", "Review Required", "High Risk")
- rationale (string, one short sentence)

Policy:
holder: ${holder}
type: ${type}
premium: ${premium || '--'}
coverage: ${coverage || '--'}
status: ${status || 'Active'}
`.trim();

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || 'AI request failed';
      if (String(message).toLowerCase().includes('quota')) {
        return res.json(fallbackResponse());
      }
      return res.status(500).json({ error: message });
    }

    const content = data?.choices?.[0]?.message?.content || '{}';
    let parsed = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      return res.status(500).json({ error: 'AI response was not valid JSON' });
    }

    const riskScore = parsed.riskScore || parsed.risk_score;
    const aiRecommendation = parsed.aiRecommendation || parsed.ai_recommendation;
    const rationale = parsed.rationale || '';

    return res.json({ riskScore, aiRecommendation, rationale });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'AI request failed' });
  }
});

export default router;
