import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({
    portfolioRiskScore: 5.8,
    riskTrend: -6.9,
    aiConfidence: 96.3,
    categories: [
      { name: 'Financial Risk', score: 6.8 },
      { name: 'Health Risk', score: 4.2 },
      { name: 'Property Risk', score: 7.5 },
      { name: 'Auto Risk', score: 5.3 },
      { name: 'Life Risk', score: 3.9 },
      { name: 'Fraud Risk', score: 2.8 }
    ],
    riskFactors: {
      labels: ['Claims Frequency', 'Customer Age', 'Coverage Amount', 'Location Risk', 'Payment History', 'Policy Duration'],
      values: [72, 40, 78, 60, 35, 45]
    },
    trendComparison: {
      months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      portfolio: [6.5, 6.3, 6.7, 6.4, 6.2, 5.8],
      industry: [7.2, 7.1, 7.3, 7.0, 6.9, 6.8]
    },
    insights: [
      { title: 'Claim Probability Increase', level: 'high', confidence: 94 },
      { title: 'Portfolio Risk Reduction', level: 'low', confidence: 87 },
      { title: 'Market Volatility Alert', level: 'medium', confidence: 91 }
    ]
  });
});

export default router;
