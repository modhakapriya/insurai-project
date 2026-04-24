 import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({
    summary: {
      revenue: 678000,
      activePolicies: 12847,
      pendingClaims: 342,
      newCustomers: 367
    },
    revenueVsClaims: {
      months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      revenue: [480000, 500000, 540000, 592000, 630000, 680000],
      claims: [320000, 335000, 350000, 342000, 360000, 375000]
    },
    claimsDistribution: [
      { label: 'Health', value: 33 },
      { label: 'Life', value: 27 },
      { label: 'Auto', value: 22 },
      { label: 'Property', value: 18 }
    ],
    growthTrends: {
      months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      newCustomers: [250, 280, 310, 300, 340, 378, 400],
      churned: [30, 28, 34, 38, 36, 41, 35],
      netGrowth: [220, 252, 276, 262, 304, 337, 365]
    }
  });
});

export default router;
