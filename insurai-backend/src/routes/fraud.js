import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({
    summary: {
      casesDetected: 847,
      amountSaved: 2400000,
      detectionRate: 94.2,
      falsePositives: 3.8
    },
    trends: {
      months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      detected: [65, 72, 85, 78, 91, 104],
      prevented: [60, 68, 80, 74, 87, 98]
    },
    types: [
      { label: 'Exaggerated Claims', value: 40 },
      { label: 'False Information', value: 29 },
      { label: 'Duplicate Claims', value: 18 },
      { label: 'Staged Accidents', value: 12 }
    ]
  });
});

export default router;
