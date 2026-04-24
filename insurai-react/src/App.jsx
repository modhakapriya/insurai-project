import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

const notify = (message) => {
  window.alert(message);
};

async function apiRequest(path, options = {}, token) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

const LoginView = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      onLogin(data.token);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <section className="auth-hero">
          <div className="hero-brand">
            <div className="brand-mark">
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path
                  d="M24 8c-6.6 0-12 4.9-12 11 0 3.8 2 7.2 5 9.2V36a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-7.8c3-2 5-5.4 5-9.2 0-6.1-5.4-11-12-11Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M17 22c2.4-2.5 6.7-2.7 9.5 0 2.6 2.5 4.5 2.7 6.5.8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h1>InsurAI</h1>
              <p>Corporate Policy Intelligence</p>
            </div>
          </div>

          <div className="hero-copy">
            <h2>Welcome to the Future of Insurance</h2>
            <p>
              AI-powered automation, predictive analytics, and intelligent policy management
              at your fingertips.
            </p>
          </div>

          <div className="hero-features">
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 3 5 6v6c0 5 4.2 8 7 9 2.8-1 7-4 7-9V6l-7-3Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h3>Advanced Security</h3>
                <p>Enterprise-grade encryption and compliance</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 4c-4.4 0-8 3.6-8 8 0 2.6 1.3 4.9 3.2 6.4V20h9.6v-1.6c1.9-1.5 3.2-3.8 3.2-6.4 0-4.4-3.6-8-8-8Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M9 20v-1m6 1v-1M8 12c1.2-1.4 3.8-1.4 5 0 1.2 1.4 3 1.5 4 .6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h3>AI-Powered Insights</h3>
                <p>Real-time analytics and predictive modeling</p>
              </div>
            </div>
          </div>

          <div className="hero-stat">
            <p>Trusted by industry leaders</p>
            <h4>12,000+</h4>
            <span>Active policies managed daily</span>
          </div>
        </section>

        <section className="auth-panel">
          <div className="panel-card">
            <div className="panel-header">
              <h2>Sign in to your account</h2>
              <p>Enter your credentials to access the platform</p>
            </div>

            <form className="panel-form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Email Address</span>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M4 6h16v12H4z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="m4 7 8 6 8-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </label>

              <label className="field">
                <span>Password</span>
                <div className="input-wrap">
                  <span className="input-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M6 11h12v8H6zM8 11V8a4 4 0 0 1 8 0v3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="ghost-btn"
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </button>
                </div>
              </label>

              <div className="form-row">
                <label className="checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <button className="link-btn" type="button" onClick={() => notify('Password reset is not enabled yet.')}>
                  Forgot password?
                </button>
              </div>

              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
              {error && <div className="auth-error">{error}</div>}

              <div className="divider">
                <span>Or continue with</span>
              </div>

              <div className="social-row">
                <button className="social-btn" type="button" onClick={() => notify('Google sign-in is not enabled yet.')}>
                  <span className="social-icon google" aria-hidden="true" />
                  Google
                </button>
                <button className="social-btn" type="button" onClick={() => notify('Facebook sign-in is not enabled yet.')}>
                  <span className="social-icon facebook" aria-hidden="true" />
                  Facebook
                </button>
              </div>
            </form>

            <p className="panel-footer">
              Don't have an account? <button className="link-btn" type="button" onClick={() => notify('Self-service sign up is not enabled yet.')}>Sign up for free</button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

const Sidebar = ({ activePage, onNavigate }) => {
  return (
    <aside className="dash-sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path
              d="M24 8c-6.6 0-12 4.9-12 11 0 3.8 2 7.2 5 9.2V36a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-7.8c3-2 5-5.4 5-9.2 0-6.1-5.4-11-12-11Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              d="M17 22c2.4-2.5 6.7-2.7 9.5 0 2.6 2.5 4.5 2.7 6.5.8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <div>
          <h2>InsurAI</h2>
          <p>Corporate Policy AI</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          Dashboard
        </button>
        <button
          className={`nav-item ${activePage === 'policies' ? 'active' : ''}`}
          onClick={() => onNavigate('policies')}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24">
              <path d="M6 3h9l3 3v15H6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M9 7h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M9 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          Policies
        </button>
        <button
          className={`nav-item ${activePage === 'claims' ? 'active' : ''}`}
          onClick={() => onNavigate('claims')}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24">
              <path d="M7 3h10l2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M9 7h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M9 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          Claims
        </button>
        <button
          className={`nav-item ${activePage === 'documents' ? 'active' : ''}`}
          onClick={() => onNavigate('documents')}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24">
              <path d="M4 7v12a2 2 0 0 0 2 2h12" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M14 3h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M10 14 20 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          Documents
        </button>
        <button
          className={`nav-item ${activePage === 'assistant' ? 'active' : ''}`}
          onClick={() => onNavigate('assistant')}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24">
              <rect x="4" y="5" width="16" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M9 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M12 9a2 2 0 1 1-2 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          AI Assistant
        </button>
        <button
          className={`nav-item ${activePage === 'risk' ? 'active' : ''}`}
          onClick={() => onNavigate('risk')}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2 4 5v6c0 5.2 4 9.4 8 11 4-1.6 8-5.8 8-11V5l-8-3Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          Risk Assessment
        </button>
        <button
          className={`nav-item ${activePage === 'fraud' ? 'active' : ''}`}
          onClick={() => onNavigate('fraud')}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 3 2 21h20L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 9v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
            </svg>
          </span>
          Fraud Detection
        </button>
      </nav>

      <div className="sidebar-credit">
        <div className="credit-title">
          <span>AI Credits</span>
          <span>750/1000</span>
        </div>
        <div className="credit-bar">
          <span style={{ width: '75%' }} />
        </div>
      </div>
    </aside>
  );
};

const DashboardContent = ({ data, onNavigate }) => {
  const policies = data?.policies || [];
  const claims = data?.claims || [];
  const documents = data?.documents || [];
  const risk = data?.risk || {};
  const fraud = data?.fraud || {};

  const parseAmount = (value) => {
    const cleaned = String(value || '').replace(/[^0-9.]/g, '');
    return cleaned ? Number(cleaned) : 0;
  };

  const parseRisk = (value) => {
    const match = String(value || '').match(/[\d.]+/);
    return match ? Number(match[0]) : 0;
  };

  const countByStatus = (items, status) => items.filter((item) => String(item.status || '').toLowerCase().includes(status)).length;
  const activePolicies = countByStatus(policies, 'active');
  const pendingClaims = claims.filter((claim) => {
    const status = String(claim.status || '').toLowerCase();
    return status.includes('pending') || status.includes('review');
  }).length;
  const portfolioRiskScore = Number(risk.portfolioRiskScore || 0);
  const reviewedClaims = claims.filter((claim) => {
    const status = String(claim.status || '').toLowerCase();
    return status.includes('approved') || status.includes('denied');
  }).length;
  const automationRate = claims.length ? ((reviewedClaims / claims.length) * 100).toFixed(1) : '0.0';

  const policyTypeCounts = policies.reduce((acc, policy) => {
    const key = policy.type || 'Other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const totalPolicyTypes = Object.values(policyTypeCounts).reduce((sum, value) => sum + value, 0) || 1;
  const policyTypeColors = ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  let policyOffset = 0;
  const policySegments = Object.entries(policyTypeCounts).map(([label, value], index) => {
    const percent = (value / totalPolicyTypes) * 100;
    const start = policyOffset;
    policyOffset += percent;
    return {
      label,
      value,
      percent,
      color: policyTypeColors[index % policyTypeColors.length],
      segment: `${policyTypeColors[index % policyTypeColors.length]} ${start}% ${policyOffset}%`
    };
  });
  const policyPie = policySegments.length
    ? `conic-gradient(${policySegments.map((item) => item.segment).join(', ')})`
    : 'conic-gradient(#dbeafe 0 100%)';

  const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const monthlyClaims = months.map((month) => ({
    label: month,
    approved: 0,
    pending: 0,
    rejected: 0
  }));
  claims.forEach((claim) => {
    const rawDate = claim.createdAt || claim.submittedAt || claim.timestamp;
    const date = rawDate ? new Date(rawDate) : null;
    if (!date || Number.isNaN(date.getTime())) return;
    const month = date.toLocaleString('en-US', { month: 'short' });
    const entry = monthlyClaims.find((item) => item.label === month);
    if (!entry) return;
    const status = String(claim.status || '').toLowerCase();
    if (status.includes('approved')) {
      entry.approved += 1;
    } else if (status.includes('denied')) {
      entry.rejected += 1;
    } else {
      entry.pending += 1;
    }
  });
  const claimsMax = Math.max(
    ...monthlyClaims.flatMap((item) => [item.approved, item.pending, item.rejected]),
    1
  );
  const hasClaimsChartData = monthlyClaims.some((item) => item.approved > 0 || item.pending > 0 || item.rejected > 0);
  const claimsTrendRows = monthlyClaims.map((item) => ({
    ...item,
    total: item.approved + item.pending + item.rejected
  }));

  const monthlyRevenue = months.map((month, index) => {
    const monthPolicies = policies.filter((policy) => {
      const rawDate = policy.createdAt || policy.timestamp;
      const date = rawDate ? new Date(rawDate) : null;
      return date && !Number.isNaN(date.getTime()) && date.toLocaleString('en-US', { month: 'short' }) === month;
    });
    const actual = monthPolicies.reduce((sum, policy) => sum + parseAmount(policy.premium), 0);
    const prediction = actual ? actual * (1 + (((index % 3) - 1) * 0.06)) : 0;
    return { month, actual, prediction };
  });
  const maxRevenue = Math.max(...monthlyRevenue.flatMap((item) => [item.actual, item.prediction]), 1);
  const hasRevenueData = monthlyRevenue.some((item) => item.actual > 0 || item.prediction > 0);
  const linePoints = monthlyRevenue.map((item, index) => {
    const x = 20 + index * 98;
    const actualY = 190 - ((item.actual / maxRevenue) * 140);
    const predictedY = 190 - ((item.prediction / maxRevenue) * 140);
    return { ...item, x, actualY, predictedY };
  });
  const actualPolyline = linePoints.map((item) => `${item.x},${item.actualY}`).join(' ');
  const predictedPolyline = linePoints.map((item) => `${item.x},${item.predictedY}`).join(' ');
  const areaPolygon = `20,210 ${linePoints.map((item) => `${item.x},${item.actualY}`).join(' ')} ${linePoints.at(-1)?.x || 20},210`;
  const latestRevenue = monthlyRevenue.findLast((item) => item.actual > 0 || item.prediction > 0) || monthlyRevenue.at(-1) || { month: 'Apr', actual: 0, prediction: 0 };
  const revenueMax = Math.max(...monthlyRevenue.flatMap((item) => [item.actual, item.prediction]), 1);

  const recentActivity = [
    ...claims.slice(0, 2).map((claim) => ({
      text: `Claim ${claim.id || '--'} is ${claim.status || 'updated'}`,
      subtext: `${claim.claimant || 'Unknown claimant'} • ${claim.type || 'General claim'}`,
      tone: String(claim.status || '').toLowerCase().includes('approved') ? 'success' : 'pulse'
    })),
    ...policies.slice(0, 2).map((policy) => ({
      text: `Policy ${policy.id || '--'} created for ${policy.holder || 'customer'}`,
      subtext: `${policy.type || 'General policy'} • Risk ${policy.riskScore || '--'}`,
      tone: 'pulse'
    })),
    ...documents.slice(0, 1).map((doc) => ({
      text: `Document ${doc.fileName || doc.name || '--'} is ${doc.status || 'processed'}`,
      subtext: `${doc.category || 'Document'} • Confidence ${doc.confidence || '--'}`,
      tone: String(doc.status || '').toLowerCase().includes('failed') ? 'alert' : 'success'
    }))
  ].slice(0, 5);

  const insights = [
    {
      title: 'Policy Exposure',
      body: `${activePolicies} active policies are currently live, with portfolio risk averaging ${portfolioRiskScore || 0}/10.`,
      level: portfolioRiskScore >= 7 ? 'high' : portfolioRiskScore >= 4 ? 'medium' : 'low'
    },
    {
      title: 'Claims Pressure',
      body: `${pendingClaims} claims are waiting for review, while ${fraud?.summary?.activeInvestigations || 0} are under fraud monitoring.`,
      level: pendingClaims >= 3 ? 'high' : pendingClaims >= 1 ? 'medium' : 'low'
    },
    {
      title: 'Document Throughput',
      body: `${documents.length} documents are in the system, with ${documents.filter((doc) => String(doc.status || '').toLowerCase().includes('processing')).length} still processing.`,
      level: documents.filter((doc) => String(doc.status || '').toLowerCase().includes('failed')).length ? 'medium' : 'low'
    }
  ];
  const hasPolicyDistribution = policySegments.length > 0;

  return (
    <main className="dash-main">
      <header className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p>AI-powered insights and real-time analytics for your insurance operations</p>
        </div>
      </header>

      <section className="stat-grid">
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon mint">
              <svg viewBox="0 0 24 24">
                <path d="M6 3h9l3 3v15H6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M9 7h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M9 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stat-change up">+12.5%</span>
          </div>
          <h3>{activePolicies}</h3>
          <p>Active Policies</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon mint">
              <svg viewBox="0 0 24 24">
                <path d="M7 3h10l2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M9 8h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stat-change down">Live</span>
          </div>
          <h3>{pendingClaims}</h3>
          <p>Pending Claims</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon amber">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
              </svg>
            </span>
            <span className="stat-change up">Live</span>
          </div>
          <h3>{portfolioRiskScore ? `${portfolioRiskScore}/10` : '0/10'}</h3>
          <p>Risk Score</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon green">
              <svg viewBox="0 0 24 24">
                <path d="m13 2-2 8H5l6 5-2 7 8-6 5-3-9-11Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="stat-change up">Live</span>
          </div>
          <h3>{automationRate}%</h3>
          <p>Automation Rate</p>
        </div>
      </section>

      <section className="dash-grid two">
        <div className="card">
          <div className="card-head">
            <h3>Claims Processing Trends</h3>
            <div className="pill-group">
              <button className="pill" onClick={() => notify('Time range switch coming soon.')}>1M</button>
              <button className="pill" onClick={() => notify('Time range switch coming soon.')}>3M</button>
              <button className="pill active" onClick={() => notify('Time range switch coming soon.')}>6M</button>
              <button className="pill" onClick={() => notify('Time range switch coming soon.')}>1Y</button>
            </div>
          </div>
          {hasClaimsChartData ? (
            <div className="dashboard-claims-chart">
              {claimsTrendRows.map((item) => (
                <div className="claims-trend-row" key={item.label}>
                  <div className="claims-trend-meta">
                    <strong>{item.label}</strong>
                    <span>{item.total} total</span>
                  </div>
                  <div className="claims-trend-bars">
                    <div className="claims-trend-track">
                      <span className="claims-trend-fill approved" style={{ width: `${(item.approved / claimsMax) * 100}%` }} />
                    </div>
                    <div className="claims-trend-track">
                      <span className="claims-trend-fill pending" style={{ width: `${(item.pending / claimsMax) * 100}%` }} />
                    </div>
                    <div className="claims-trend-track">
                      <span className="claims-trend-fill rejected" style={{ width: `${(item.rejected / claimsMax) * 100}%` }} />
                    </div>
                  </div>
                  <div className="claims-trend-values">
                    <span className="text-green">{item.approved}</span>
                    <span className="text-amber">{item.pending}</span>
                    <span className="text-red">{item.rejected}</span>
                  </div>
                </div>
              ))}
              <div className="legend">
                <span className="dot approved" /> Approved
                <span className="dot pending" /> Pending
                <span className="dot rejected" /> Rejected
              </div>
            </div>
          ) : (
            <div className="empty-state">No claims trend data is available yet. Create or update claims to populate this chart.</div>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Policy Distribution</h3>
          </div>
          {hasPolicyDistribution ? (
            <div className="distribution-list">
              {policySegments.map((item) => (
                <div className="distribution-row" key={item.label}>
                  <div className="distribution-head">
                    <strong>{item.label}</strong>
                    <span>{item.value} policies</span>
                  </div>
                  <div className="distribution-track">
                    <span style={{ width: `${item.percent}%`, background: item.color }} />
                  </div>
                  <div className="distribution-percent">{item.percent.toFixed(1)}%</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">No policy distribution data yet. Create policies to see the portfolio mix.</div>
          )}
        </div>
      </section>

      <section className="dash-grid two">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Revenue vs AI Prediction</h3>
              <p>Prediction uses current policy premium trend and portfolio velocity</p>
            </div>
          </div>
          {hasRevenueData ? (
            <div className="revenue-compare-chart">
              {monthlyRevenue.map((item) => (
                <div className="revenue-compare-group" key={item.month}>
                  <div className="revenue-compare-bars">
                    <span className="revenue-bar actual" style={{ height: `${Math.max(10, (item.actual / revenueMax) * 150)}px` }} />
                    <span className="revenue-bar predicted" style={{ height: `${Math.max(10, (item.prediction / revenueMax) * 150)}px` }} />
                  </div>
                  <div className="revenue-compare-label">{item.month}</div>
                </div>
              ))}
              <div className="legend">
                <span className="dot approved" /> Actual
                <span className="dot net" /> Predicted
              </div>
              <div className="dashboard-summary-note">
                <strong>{latestRevenue.month}</strong> Actual: {Math.round(latestRevenue.actual).toLocaleString()} | Predicted: {Math.round(latestRevenue.prediction).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="empty-state">No revenue trend is available yet. Add policies with premiums to build this chart.</div>
          )}
        </div>

        <div className="card insights">
          <div className="card-head">
            <h3>AI Insights</h3>
          </div>
          <div className="insight-list">
            {insights.map((item) => (
              <div className="insight-item" key={item.title}>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.body}</p>
                </div>
                <span className={`badge ${item.level}`}>{item.level}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card recent">
        <div className="card-head">
          <h3>Recent Activity</h3>
        </div>
        <div className="activity-list">
          {recentActivity.length ? recentActivity.map((item, index) => (
            <div className="activity-item" key={`${item.text}-${index}`}>
              <span className={`activity-icon ${item.tone}`}>
                <svg viewBox="0 0 24 24">
                  {item.tone === 'alert' ? (
                    <>
                      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="16" r="1" fill="currentColor" />
                    </>
                  ) : item.tone === 'success' ? (
                    <>
                      <path d="m5 12 4 4 10-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    </>
                  ) : (
                    <path d="M3 12h4l2-4 4 10 2-6h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  )}
                </svg>
              </span>
              <div>
                <p>{item.text}</p>
                <span>{item.subtext}</span>
              </div>
            </div>
          )) : (
            <div className="empty-state">No recent activity yet. Create a policy, claim, or document to populate the dashboard.</div>
          )}
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>Quick Actions</h3>
        </div>
        <div className="quick-actions-grid">
          <button className="quick-action-card" type="button" onClick={() => onNavigate('policies')}>
            <strong>Open Policies</strong>
            <span>Review coverage, AI recommendations, and portfolio mix.</span>
          </button>
          <button className="quick-action-card" type="button" onClick={() => onNavigate('claims')}>
            <strong>Review Claims</strong>
            <span>Check pending claims, AI confidence, and recent approvals.</span>
          </button>
          <button className="quick-action-card" type="button" onClick={() => onNavigate('documents')}>
            <strong>Process Documents</strong>
            <span>Upload evidence, review OCR confidence, and monitor failures.</span>
          </button>
          <button className="quick-action-card" type="button" onClick={() => onNavigate('fraud')}>
            <strong>Open Fraud Review</strong>
            <span>Inspect suspicious cases and reopen resolved investigations if needed.</span>
          </button>
        </div>
      </section>
    </main>
  );
};

const PoliciesContent = ({ policies, onCreate, onGenerateAi, onUpdate, onDelete }) => {
  const fallback = [
    { id: 'POL-2024-001', holder: 'Sarah Johnson', type: 'Life Insurance', premium: '$450/mo', coverage: '$500,000', status: 'Active', riskScore: '3.2/10', aiRecommendation: 'Standard' },
    { id: 'POL-2024-002', holder: 'Michael Chen', type: 'Health Insurance', premium: '$380/mo', coverage: '$250,000', status: 'Active', riskScore: '2.8/10', aiRecommendation: 'Preferred' },
    { id: 'POL-2024-003', holder: 'Emily Rodriguez', type: 'Auto Insurance', premium: '$125/mo', coverage: '$100,000', status: 'Pending', riskScore: '6.5/10', aiRecommendation: 'Review Required' },
    { id: 'POL-2024-004', holder: 'David Thompson', type: 'Property Insurance', premium: '$290/mo', coverage: '$750,000', status: 'Active', riskScore: '4.1/10', aiRecommendation: 'Standard' },
    { id: 'POL-2024-005', holder: 'Jessica Williams', type: 'Life Insurance', premium: '$520/mo', coverage: '$600,000', status: 'Expired', riskScore: '3.5/10', aiRecommendation: 'Renewal Suggested' }
  ];
  const rows = policies && policies.length ? policies : fallback;
  const typeOptions = ['Life Insurance', 'Health Insurance', 'Auto Insurance', 'Property Insurance'];
  const statusOptions = ['Active', 'Pending', 'Expired'];
  const emptyForm = {
    holder: '',
    type: '',
    premium: '',
    coverage: '',
    status: 'Active',
    riskScore: '',
    aiRecommendation: ''
  };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const formRef = useRef(null);
  const tableRef = useRef(null);

  const normalizeSearch = (value) => String(value || '').toLowerCase().replace(/[\s-]/g, '');
  const tokenize = (value) => String(value || '').toLowerCase().split(/[\s-]+/).filter(Boolean);

  const filteredRows = rows.filter((row) => {
    const query = searchTerm.trim().toLowerCase();
    const normalizedQuery = normalizeSearch(query);
    const rowId = String(row.id || '').toLowerCase();
    const normalizedId = normalizeSearch(row.id);
    const holder = String(row.holder || '').toLowerCase();
    const holderTokens = tokenize(row.holder);

    const matchesQuery =
      !query ||
      rowId.includes(query) ||
      normalizedId.includes(normalizedQuery) ||
      holder.includes(query) ||
      holderTokens.some((token) => token.startsWith(query));

    const matchesType = typeFilter === 'All Types' || row.type === typeFilter;
    const matchesStatus = statusFilter === 'All Statuses' || row.status === statusFilter;
    return matchesQuery && matchesType && matchesStatus;
  });

  const activeCount = rows.filter((row) => String(row.status).toLowerCase() === 'active').length;
  const pendingCount = rows.filter((row) => String(row.status).toLowerCase() === 'pending').length;
  const aiReadyCount = rows.filter((row) => row.aiRecommendation && row.aiRecommendation !== '--').length;

  const scrollToForm = () => {
    if (!formRef.current) return;
    const top = formRef.current.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const scrollToTable = () => {
    if (!tableRef.current) return;
    const top = tableRef.current.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
  };

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateAi = async () => {
    setError('');
    setSuccess('');
    if (!form.holder || !form.type) {
      setError('Holder and policy type are required before AI analysis.');
      return;
    }
    setAiLoading(true);
    try {
      const result = await onGenerateAi({
        holder: form.holder,
        type: form.type,
        premium: form.premium,
        coverage: form.coverage,
        status: form.status
      });
      setForm((prev) => ({
        ...prev,
        riskScore: result.riskScore || '',
        aiRecommendation: result.aiRecommendation || ''
      }));
      if (result?.rationale) {
        setSuccess(result.rationale);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate AI recommendation.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleEdit = (row) => {
    setError('');
    setSuccess('');
    setEditingId(row.id);
    setForm({
      holder: row.holder || '',
      type: row.type || '',
      premium: row.premium || '',
      coverage: row.coverage || '',
      status: row.status || 'Active',
      riskScore: row.riskScore || '',
      aiRecommendation: row.aiRecommendation || ''
    });
    scrollToForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete policy ${id}?`)) return;
    setError('');
    setSuccess('');
    try {
      await onDelete(id);
      if (editingId === id) {
        resetForm();
      }
      setSuccess(`Policy ${id} deleted.`);
    } catch (err) {
      setError(err.message || 'Failed to delete policy.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.holder || !form.type) {
      setError('Holder and policy type are required.');
      return;
    }
    if (!form.riskScore || !form.aiRecommendation) {
      setError('Generate AI recommendation before saving.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await onUpdate(editingId, form);
        setSuccess(`Policy ${editingId} updated successfully.`);
      } else {
        await onCreate(form);
        setSuccess('Policy created successfully.');
      }
      resetForm();
    } catch (err) {
      setError(err.message || `Failed to ${editingId ? 'update' : 'create'} policy.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="dash-main">
      <header className="dash-header policies-header">
        <div>
          <h1>Policy Management</h1>
          <p>Manage and automate policy workflows with AI assistance</p>
        </div>
        <button className="primary-btn create-btn" type="button" onClick={scrollToForm}>
          <span className="plus">+</span> Create Policy
        </button>
      </header>

      <section className="policy-stats">
        <div className="policy-stat">
          <p>Total Policies</p>
          <h3>{rows.length}</h3>
        </div>
        <div className="policy-stat">
          <p>Active</p>
          <h3 className="text-green">{activeCount}</h3>
        </div>
        <div className="policy-stat">
          <p>Pending Review</p>
          <h3 className="text-amber">{pendingCount}</h3>
        </div>
        <div className="policy-stat">
          <p>AI Processed</p>
          <h3 className="text-teal">{aiReadyCount}</h3>
        </div>
      </section>

      <section className="policy-filters">
        <div className="search-field">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search policies by ID, holder name, or type..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              requestAnimationFrame(scrollToTable);
            }}
          />
        </div>
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            requestAnimationFrame(scrollToTable);
          }}
        >
          <option>All Types</option>
          {typeOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            requestAnimationFrame(scrollToTable);
          }}
        >
          <option>All Statuses</option>
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button
          className="filter-btn"
          type="button"
          onClick={() => {
            setSearchTerm('');
            setTypeFilter('All Types');
            setStatusFilter('All Statuses');
            requestAnimationFrame(scrollToTable);
          }}
        >
          Reset Filters
        </button>
      </section>

      <section className="table-footer">
        <span>
          {searchTerm.trim()
            ? `Found ${filteredRows.length} match${filteredRows.length === 1 ? '' : 'es'} for "${searchTerm.trim()}"`
            : `Showing ${filteredRows.length} of ${rows.length} policies`}
        </span>
      </section>

      <section className="policy-table" ref={tableRef}>
        <div className="table-head table-head-policy">
          <span>Policy ID</span>
          <span>Holder</span>
          <span>Type</span>
          <span>Premium</span>
          <span>Coverage</span>
          <span>Status</span>
          <span>Risk Score</span>
          <span>AI Recommendation</span>
          <span>Actions</span>
        </div>
        {filteredRows.map((row) => {
          const status = (row.status || '').toLowerCase();
          const tag = status.includes('pending') ? 'pending' : status.includes('expired') ? 'expired' : 'active';
          return (
            <div className="table-row table-row-policy" key={row.id}>
              <span className="policy-id">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 3h9l3 3v15H6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M9 7h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M9 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                {row.id}
              </span>
              <span>{row.holder}</span>
              <span>{row.type}</span>
              <span className="bold">{row.premium}</span>
              <span className="bold">{row.coverage}</span>
              <span className={`status-pill ${tag}`}>{row.status}</span>
              <span className={tag === 'pending' ? 'text-amber' : tag === 'expired' ? 'text-red' : 'text-green'}>{row.riskScore || row.score}</span>
              <span className="muted">{row.aiRecommendation || row.rec}</span>
              <span className="row-actions">
                <button type="button" className="row-action-btn" onClick={() => handleEdit(row)}>Edit</button>
                <button type="button" className="row-action-btn row-action-btn-danger" onClick={() => handleDelete(row.id)}>Delete</button>
              </span>
            </div>
          );
        })}
        {!filteredRows.length && (
          <div className="table-empty">
            No policies match the current filters.
          </div>
        )}
      </section>

      <section className="ai-banner">
        <div className="ai-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2v5M12 17v5M4.2 4.2l3.5 3.5M16.3 16.3l3.5 3.5M2 12h5M17 12h5M4.2 19.8l3.5-3.5M16.3 7.7l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </div>
        <div>
          <h4>AI Recommendations Ready</h4>
          <p>{aiReadyCount} policies have AI analysis attached and are ready for review.</p>
        </div>
        <button className="primary-btn" type="button" onClick={scrollToForm}>Open Policy Form</button>
      </section>

      <section className="form-card" ref={formRef} id="create-policy-form">
        <div className="form-head">
          <h3>{editingId ? `Edit Policy ${editingId}` : 'Create New Policy'}</h3>
          <p>{editingId ? 'Update the selected policy and save the changes.' : 'Add a policy and store it in the database.'}</p>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Policy Holder</span>
            <div className="input-wrap">
              <input value={form.holder} onChange={handleChange('holder')} placeholder="Jane Smith" />
            </div>
          </label>
          <label className="field">
            <span>Policy Type</span>
            <div className="input-wrap">
              <select value={form.type} onChange={handleChange('type')}>
                <option value="">Select type</option>
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </label>
          <label className="field">
            <span>Premium</span>
            <div className="input-wrap">
              <input value={form.premium} onChange={handleChange('premium')} placeholder="$320/mo" />
            </div>
          </label>
          <label className="field">
            <span>Coverage</span>
            <div className="input-wrap">
              <input value={form.coverage} onChange={handleChange('coverage')} placeholder="$350,000" />
            </div>
          </label>
          <label className="field">
            <span>Status</span>
            <div className="input-wrap">
              <select value={form.status} onChange={handleChange('status')}>
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </label>
          <label className="field">
            <span>Risk Score</span>
            <div className="input-wrap">
              <input value={form.riskScore} readOnly placeholder="Auto-generated" />
            </div>
          </label>
          <label className="field">
            <span>AI Recommendation</span>
            <div className="input-wrap">
              <input value={form.aiRecommendation} readOnly placeholder="Auto-generated" />
            </div>
          </label>
          <div className="form-actions">
            <button className="primary-btn" type="button" onClick={handleGenerateAi} disabled={aiLoading}>
              {aiLoading ? 'Analyzing...' : editingId ? 'Recalculate AI' : 'Generate AI Recommendation'}
            </button>
            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Policy' : 'Create Policy'}
            </button>
            {editingId && (
              <button className="filter-btn" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
            {error && <span className="form-error">{error}</span>}
            {success && <span className="form-success">{success}</span>}
          </div>
        </form>
      </section>
    </main>
  );
};

const ClaimsContent = ({ claims, onCreate, onUpdate, onDelete, onGenerateAi }) => {
  const fallback = [
    { id: 'CL-2024-2847', claimant: 'Sarah Johnson', type: 'Health', amount: '$12,500', status: 'Approved', aiConfidence: '95%', submitted: '2026-02-28', processing: '2-3 days' },
    { id: 'CL-2024-2848', claimant: 'Michael Chen', type: 'Auto', amount: '$8,750', status: 'Pending', aiConfidence: '88%', submitted: '2026-03-05', processing: 'Under review' },
    { id: 'CL-2024-2849', claimant: 'Emily Rodriguez', type: 'Property', amount: '$45,000', status: 'Reviewing', aiConfidence: '72%', submitted: '2026-03-04', processing: '5-7 days' },
    { id: 'CL-2024-2850', claimant: 'David Thompson', type: 'Auto', amount: '$3,200', status: 'Flagged', aiConfidence: '45%', submitted: '2026-03-06', processing: 'Pending investigation' },
    { id: 'CL-2024-2851', claimant: 'Jessica Williams', type: 'Health', amount: '$6,800', status: 'Approved', aiConfidence: '92%', submitted: '2026-03-02', processing: 'Processed' }
  ];
  const rows = claims && claims.length ? claims : fallback;
  const [form, setForm] = useState({
    claimant: '',
    type: '',
    amount: '',
    status: 'Pending',
    aiConfidence: '',
    submitted: '',
    processing: ''
  });
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const formRef = useRef(null);

  const normalizeSearch = (value) => String(value || '').toLowerCase().replace(/[\s-]/g, '');
  const tokenize = (value) => String(value || '').toLowerCase().split(/[\s-]+/).filter(Boolean);

  const filteredRows = rows.filter((row) => {
    const query = searchTerm.trim().toLowerCase();
    const normalizedQuery = normalizeSearch(query);
    const rowId = String(row.id || '').toLowerCase();
    const normalizedId = normalizeSearch(row.id);
    const claimant = String(row.claimant || row.name || '').toLowerCase();
    const claimantTokens = tokenize(row.claimant || row.name);
    const matchesQuery =
      !query ||
      rowId.includes(query) ||
      normalizedId.includes(normalizedQuery) ||
      claimant.includes(query) ||
      claimantTokens.some((token) => token.startsWith(query));
    const matchesStatus = statusFilter === 'All Statuses' || row.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const parseCurrency = (value) => {
    const cleaned = String(value || '').replace(/[^0-9.]/g, '');
    return cleaned ? Number.parseFloat(cleaned) : 0;
  };

  const parsePercent = (value) => {
    const cleaned = String(value || '').replace(/[^0-9.]/g, '');
    return cleaned ? Number.parseFloat(cleaned) : 0;
  };

  const approvedClaims = rows.filter((row) => String(row.status || '').toLowerCase() === 'approved');
  const reviewClaims = rows.filter((row) => {
    const status = String(row.status || '').toLowerCase();
    return status === 'reviewing' || status === 'flagged';
  });
  const pendingClaims = rows.filter((row) => String(row.status || '').toLowerCase() === 'pending');
  const autoApproveReady = rows.filter((row) => parsePercent(row.aiConfidence || row.score) >= 90);
  const amountSaved = approvedClaims.reduce((sum, row) => sum + parseCurrency(row.amount), 0);
  const avgAiConfidence = rows.length
    ? rows.reduce((sum, row) => sum + parsePercent(row.aiConfidence || row.score), 0) / rows.length
    : 0;
  const processingDays = rows
    .map((row) => {
      const note = String(row.processing || row.proc || '').toLowerCase();
      const match = note.match(/(\d+)(?:\s*-\s*(\d+))?/);
      if (!match) return note.includes('processed') ? 1 : note.includes('review') ? 3 : note.includes('investigation') ? 5 : null;
      const first = Number.parseInt(match[1], 10);
      const second = match[2] ? Number.parseInt(match[2], 10) : first;
      return (first + second) / 2;
    })
    .filter((value) => value !== null);
  const avgProcessingDays = processingDays.length
    ? processingDays.reduce((sum, value) => sum + value, 0) / processingDays.length
    : 2.3;
  const successRate = rows.length ? ((approvedClaims.length + autoApproveReady.length) / (rows.length * 2)) * 100 : 0;

  const scrollToForm = () => {
    if (!formRef.current) return;
    const top = formRef.current.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm({
      claimant: '',
      type: '',
      amount: '',
      status: 'Pending',
      aiConfidence: '',
      submitted: '',
      processing: ''
    });
    setEditingId('');
  };

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleEdit = (row) => {
    setError('');
    setSuccess('');
    setEditingId(row.id);
    setForm({
      claimant: row.claimant || row.name || '',
      type: row.type || '',
      amount: row.amount || '',
      status: row.status || 'Pending',
      aiConfidence: row.aiConfidence || row.score || '',
      submitted: row.submitted || row.date || '',
      processing: row.processing || row.proc || ''
    });
    scrollToForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete claim ${id}?`)) return;
    setError('');
    setSuccess('');
    try {
      await onDelete(id);
      if (editingId === id) {
        resetForm();
      }
      setSuccess(`Claim ${id} deleted.`);
    } catch (err) {
      setError(err.message || 'Failed to delete claim.');
    }
  };

  const handleGenerateAi = async () => {
    setError('');
    setSuccess('');
    if (!form.claimant || !form.type) {
      setError('Claimant and claim type are required before AI analysis.');
      return;
    }
    setAiLoading(true);
    try {
      const result = await onGenerateAi(form);
      setForm((prev) => ({
        ...prev,
        aiConfidence: result.aiConfidence || prev.aiConfidence,
        status: result.recommendedStatus || prev.status,
        processing: result.processingNote || prev.processing
      }));
      if (result?.rationale) {
        setSuccess(result.rationale);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate AI claim analysis.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.claimant || !form.type) {
      setError('Claimant and claim type are required.');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await onUpdate(editingId, form);
        setSuccess(`Claim ${editingId} updated successfully.`);
      } else {
        await onCreate(form);
        setSuccess('Claim created successfully.');
      }
      resetForm();
    } catch (err) {
      setError(err.message || `Failed to ${editingId ? 'update' : 'create'} claim.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="dash-main">
      <header className="dash-header">
        <div>
          <h1>Claims Processing</h1>
          <p>AI-powered claims automation with fraud detection and instant approvals</p>
        </div>
      </header>

      <section className="claims-stats">
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon blue">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stat-change down">{pendingClaims.length ? `-${pendingClaims.length * 4}%` : '-0%'}</span>
          </div>
          <h3>{avgProcessingDays.toFixed(1)} days</h3>
          <p>Avg Processing Time</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon blue">
              <svg viewBox="0 0 24 24">
                <path d="m13 2-2 8H5l6 5-2 7 8-6 5-3-9-11Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="stat-change up">+{autoApproveReady.length * 6}%</span>
          </div>
          <h3>{rows.length ? Math.round((autoApproveReady.length / rows.length) * 100) : 0}%</h3>
          <p>Auto-Approval Rate</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon blue">
              <svg viewBox="0 0 24 24">
                <path d="M6 3h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M12 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M8 9h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stat-change up">+{approvedClaims.length * 7}%</span>
          </div>
          <h3>${(amountSaved / 1000000).toFixed(2)}M</h3>
          <p>Cost Savings</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon blue">
              <svg viewBox="0 0 24 24">
                <path d="M4 16l5-5 4 4 7-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stat-change up">+{Math.max(1, rows.length)}%</span>
          </div>
          <h3>{avgAiConfidence.toFixed(1)}%</h3>
          <p>Accuracy Score</p>
        </div>
      </section>

      <section className="claims-banner">
        <div className="ai-icon green">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m13 2-2 8H5l6 5-2 7 8-6 5-3-9-11Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h4>AI Automation Active</h4>
          <p>Processing {rows.length} claims | {approvedClaims.length} approved | {reviewClaims.length} under review</p>
        </div>
        <div className="success-ring">
          <div>
            <span>Success Rate</span>
            <strong>{successRate.toFixed(1)}%</strong>
          </div>
          <div className="ring" />
        </div>
      </section>

      <section className="claims-actions">
        <div className="mini-card">
          <span className="mini-icon blue">
            <svg viewBox="0 0 24 24">
              <path d="m13 2-2 8H5l6 5-2 7 8-6 5-3-9-11Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </span>
          <div>
            <h4>Auto-Approve Ready</h4>
            <p>{autoApproveReady.length} claims (AI Score &gt;= 90)</p>
          </div>
        </div>
        <div className="mini-card">
          <span className="mini-icon amber">
            <svg viewBox="0 0 24 24">
              <path d="M12 3 3 21h18L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 9v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
            </svg>
          </span>
          <div>
            <h4>Requires Review</h4>
            <p>{reviewClaims.length} claims flagged or reviewing</p>
          </div>
        </div>
        <div className="mini-card">
          <span className="mini-icon green">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <h4>Bulk Processing</h4>
            <p>{pendingClaims.length} claims pending standard processing</p>
          </div>
        </div>
      </section>

      <section className="claims-search">
        <div className="search-field">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search claims by ID or claimant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All Statuses</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Reviewing</option>
          <option>Flagged</option>
        </select>
        <button
          className="filter-btn"
          type="button"
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('All Statuses');
          }}
        >
          Reset Filters
        </button>
      </section>

      <section className="policy-table claims-table">
        <div className="table-head claims-table-head">
          <span>Claim ID</span>
          <span>Claimant</span>
          <span>Type</span>
          <span>Amount</span>
          <span>Status</span>
          <span>AI Confidence</span>
          <span>Submitted</span>
          <span>Processing</span>
          <span>Actions</span>
        </div>
        {filteredRows.map((row) => {
          const status = (row.status || '').toLowerCase();
          const tag = status.includes('approved') ? 'approved' : status.includes('pending') ? 'pending' : status.includes('review') ? 'review' : 'flagged';
          return (
            <div className="table-row claims-table-row" key={row.id}>
              <span className="policy-id">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 3h9l3 3v15H6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M9 7h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M9 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                {row.id}
              </span>
              <span className="claimant">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M4 21c1.5-3.5 14.5-3.5 16 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                {row.claimant || row.name}
              </span>
              <span>{row.type}</span>
              <span className="bold">{row.amount}</span>
              <span className={`status-pill ${tag}`}>{row.status}</span>
              <span className={`confidence ${tag}`}>{row.aiConfidence || row.score}</span>
              <span className="muted">{row.submitted || row.date}</span>
              <span className="muted">{row.processing || row.proc}</span>
              <span className="row-actions">
                <button type="button" className="row-action-btn" onClick={() => handleEdit(row)}>Edit</button>
                <button type="button" className="row-action-btn row-action-btn-danger" onClick={() => handleDelete(row.id)}>Delete</button>
              </span>
            </div>
          );
        })}
        {!filteredRows.length && (
          <div className="table-empty">
            No claims match the current filters.
          </div>
        )}
      </section>

      <section className="table-footer">
        <span>
          {searchTerm.trim()
            ? `Found ${filteredRows.length} match${filteredRows.length === 1 ? '' : 'es'} for "${searchTerm.trim()}"`
            : `Showing ${filteredRows.length} of ${rows.length} claims`}
        </span>
      </section>

      <section className="form-card" ref={formRef}>
        <div className="form-head">
          <h3>{editingId ? `Edit Claim ${editingId}` : 'Create New Claim'}</h3>
          <p>{editingId ? 'Update the selected claim and save the changes.' : 'Log a new claim and store it in the database.'}</p>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Claimant</span>
            <div className="input-wrap">
              <input value={form.claimant} onChange={handleChange('claimant')} placeholder="Jane Smith" />
            </div>
          </label>
          <label className="field">
            <span>Claim Type</span>
            <div className="input-wrap">
              <input value={form.type} onChange={handleChange('type')} placeholder="Property" />
            </div>
          </label>
          <label className="field">
            <span>Amount</span>
            <div className="input-wrap">
              <input value={form.amount} onChange={handleChange('amount')} placeholder="$4,200" />
            </div>
          </label>
          <label className="field">
            <span>Status</span>
            <div className="input-wrap">
              <input value={form.status} onChange={handleChange('status')} placeholder="Pending" />
            </div>
          </label>
          <label className="field">
            <span>AI Confidence</span>
            <div className="input-wrap">
              <input value={form.aiConfidence} readOnly placeholder="Auto-generated" />
            </div>
          </label>
          <label className="field">
            <span>Submitted Date</span>
            <div className="input-wrap">
              <input value={form.submitted} onChange={handleChange('submitted')} placeholder="2026-03-18" />
            </div>
          </label>
          <label className="field">
            <span>Processing Note</span>
            <div className="input-wrap">
              <input value={form.processing} onChange={handleChange('processing')} placeholder="Under review" />
            </div>
          </label>
          <div className="form-actions">
            <button className="primary-btn" type="button" onClick={handleGenerateAi} disabled={aiLoading}>
              {aiLoading ? 'Analyzing...' : editingId ? 'Recalculate AI' : 'Generate AI Confidence'}
            </button>
            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Claim' : 'Create Claim'}
            </button>
            {editingId && (
              <button className="filter-btn" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
            {error && <span className="form-error">{error}</span>}
            {success && <span className="form-success">{success}</span>}
          </div>
        </form>
      </section>
    </main>
  );
};

const DocumentsContent = ({ documents, onCreate, onDelete, onUpload, onDownload, onClassify }) => {
  const fallback = [
    { id: 'DOC-001', name: 'medical_report_johnson.pdf', category: 'Medical Record', size: '2.4 MB', timestamp: '2026-03-07 09:23', status: 'Processed', confidence: '98%' },
    { id: 'DOC-002', name: 'accident_report_chen.jpg', category: 'Accident Report', size: '1.8 MB', timestamp: '2026-03-07 10:15', status: 'Processing', confidence: '--' }
  ];
  const docs = documents && documents.length ? documents : fallback;
  const [form, setForm] = useState({
    name: '',
    category: '',
    size: '',
    timestamp: '',
    status: 'Processing',
    confidence: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [classifying, setClassifying] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const fileInputRef = useRef(null);

  const parseSizeToMb = (value) => {
    const raw = String(value || '').trim().toUpperCase();
    const numeric = Number.parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (!Number.isFinite(numeric)) return 0;
    if (raw.includes('KB')) return numeric / 1024;
    if (raw.includes('GB')) return numeric * 1024;
    return numeric;
  };

  const parsePercent = (value) => {
    const numeric = Number.parseFloat(String(value || '').replace(/[^0-9.]/g, ''));
    return Number.isFinite(numeric) ? numeric : null;
  };

  const totalDocs = docs.length;
  const processedDocs = docs.filter((doc) => String(doc.status || '').toLowerCase() === 'processed').length;
  const processingDocs = docs.filter((doc) => String(doc.status || '').toLowerCase() === 'processing').length;
  const failedDocs = docs.filter((doc) => String(doc.status || '').toLowerCase() === 'failed').length;
  const successRate = totalDocs ? (processedDocs / totalDocs) * 100 : 0;
  const confidenceValues = docs.map((doc) => parsePercent(doc.confidence)).filter((value) => value !== null);
  const avgConfidence = confidenceValues.length
    ? confidenceValues.reduce((sum, value) => sum + value, 0) / confidenceValues.length
    : 0;
  const avgSizeMb = totalDocs
    ? docs.reduce((sum, doc) => sum + parseSizeToMb(doc.size), 0) / totalDocs
    : 0;
  const categoryCounts = docs.reduce((acc, doc) => {
    const key = doc.category || 'Uncategorized';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  const recentTimestamp = docs[0]?.timestamp || '--';

  const handleView = (doc) => {
    notify(`Document details:\\n\\n${JSON.stringify(doc, null, 2)}`);
  };

  const handleDownload = (doc) => {
    if (doc?.storagePath) {
      onDownload(doc);
      return;
    }
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${doc.id || 'document'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (doc) => {
    if (!doc?.id) {
      notify('This document cannot be deleted.');
      return;
    }
    const existsInDb = documents && documents.some((row) => row.id === doc.id);
    if (!existsInDb) {
      notify('This document is sample data only.');
      return;
    }
    try {
      await onDelete(doc.id);
      notify(`Deleted ${doc.id}.`);
    } catch (err) {
      notify(err.message || 'Failed to delete document.');
    }
  };

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name || !form.category) {
      setError('Document name and category are required.');
      return;
    }
    setSaving(true);
    try {
      await onCreate(form);
      setSuccess('Document created successfully.');
      setForm({
        name: '',
        category: '',
        size: '',
        timestamp: '',
        status: 'Processing',
        confidence: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to create document.');
    } finally {
      setSaving(false);
    }
  };

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const previewFile = async (file) => {
    if (!file) {
      setSelectedFile(null);
      setUploadPreview(null);
      return;
    }
    setSelectedFile(file);
    setUploadPreview(null);
    setClassifying(true);
    setError('');
    setSuccess('');
    try {
      const preview = await onClassify(file);
      setUploadPreview(preview);
    } catch (err) {
      setError(err.message || 'Failed to classify document before upload.');
    } finally {
      setClassifying(false);
    }
  };

  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0] || null;
    await previewFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0] || null;
    if (file) {
      await previewFile(file);
    }
  };

  const handleUploadSelected = async () => {
    if (!selectedFile) {
      notify('Choose a file first.');
      return;
    }
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const uploaded = await onUpload({
        file: selectedFile,
        status: 'Processed'
      });
      setSelectedFile(null);
      setUploadPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setSuccess(`Uploaded successfully. ${uploaded.aiSource || 'AI'} detected ${uploaded.category} with ${uploaded.confidence || '--'} confidence.`);
    } catch (err) {
      setError(err.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="dash-main">
      <header className="dash-header">
        <div>
          <h1>Document Processing</h1>
          <p>AI-powered OCR and intelligent data extraction from insurance documents</p>
        </div>
      </header>

      <section className="doc-stats">
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon mint">
              <svg viewBox="0 0 24 24">
                <path d="M6 3h9l3 3v15H6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M9 7h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M9 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <h3>{totalDocs}</h3>
          <p>Total Documents</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon green">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <h3>{successRate.toFixed(1)}%</h3>
          <p>Success Rate</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon mint">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <h3>{avgSizeMb.toFixed(1)} MB</h3>
          <p>Avg File Size</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon mint">
              <svg viewBox="0 0 24 24">
                <path d="M12 2v5M12 17v5M4.2 4.2l3.5 3.5M16.3 16.3l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
          </div>
          <h3>{avgConfidence ? `${avgConfidence.toFixed(1)}%` : '--'}</h3>
          <p>Data Accuracy</p>
        </div>
      </section>

      <section
        className={`upload-card ${dragActive ? 'drag-active' : ''}`.trim()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-inner">
          <div className="upload-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 3v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="m7 8 5-5 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <h3>Upload Documents for AI Processing</h3>
          <p>{selectedFile ? `${selectedFile.name} selected` : 'Drag and drop files here, or click to browse'}</p>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileSelected}
          />
          {selectedFile && (
            <div className="upload-preview">
              <div>
                <span>Selected File</span>
                <strong>{selectedFile.name}</strong>
              </div>
              <div>
                <span>Detected Category</span>
                <strong>{classifying ? 'Analyzing...' : uploadPreview?.category || '--'}</strong>
              </div>
              <div>
                <span>AI Confidence</span>
                <strong>{classifying ? 'Analyzing...' : uploadPreview?.confidence || '--'}</strong>
              </div>
              <div>
                <span>Source</span>
                <strong>{classifying ? 'Analyzing...' : uploadPreview?.source || '--'}</strong>
              </div>
              <div className="upload-preview-note">
                {classifying ? 'Running AI classification before upload...' : uploadPreview?.rationale || 'Choose a file to preview the AI classification.'}
              </div>
            </div>
          )}
          <div className="upload-actions">
            <button className="primary-btn" type="button" onClick={handlePickFile}>Choose Files</button>
            <button className="primary-btn" type="button" onClick={handleUploadSelected} disabled={uploading || classifying || !selectedFile}>
              {uploading ? 'Uploading...' : 'Upload Selected'}
            </button>
            <button className="ghost-action" type="button" onClick={() => notify('Document scanning is not implemented yet.')}>Scan Document</button>
          </div>
          <span className="upload-note">Supports PDF, JPG, PNG, DOCX - Max file size: 50MB</span>
          {error && <span className="form-error">{error}</span>}
          {success && <span className="form-success">{success}</span>}
        </div>
      </section>

      <section className="form-card">
        <div className="form-head">
          <h3>Add Document Metadata</h3>
          <p>Create a document record that is stored in the database.</p>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>File Name</span>
            <div className="input-wrap">
              <input value={form.name} onChange={handleChange('name')} placeholder="inspection_report.pdf" />
            </div>
          </label>
          <label className="field">
            <span>Category</span>
            <div className="input-wrap">
              <input value={form.category} onChange={handleChange('category')} placeholder="Inspection" />
            </div>
          </label>
          <label className="field">
            <span>Size</span>
            <div className="input-wrap">
              <input value={form.size} onChange={handleChange('size')} placeholder="1.2 MB" />
            </div>
          </label>
          <label className="field">
            <span>Timestamp</span>
            <div className="input-wrap">
              <input value={form.timestamp} onChange={handleChange('timestamp')} placeholder="2026-03-18 10:30" />
            </div>
          </label>
          <label className="field">
            <span>Status</span>
            <div className="input-wrap">
              <input value={form.status} onChange={handleChange('status')} placeholder="Processing" />
            </div>
          </label>
          <label className="field">
            <span>Confidence</span>
            <div className="input-wrap">
              <input value={form.confidence} onChange={handleChange('confidence')} placeholder="97%" />
            </div>
          </label>
          <div className="form-actions">
            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Create Document'}
            </button>
          </div>
        </form>
      </section>

      <section className="doc-features">
        <div className="feature-card blue">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24">
              <path d="M7 4h4M4 7v4M17 4h-4M20 7v4M7 20h4M4 17v-4M17 20h-4M20 17v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <h4>Processed Documents</h4>
          <p>{processedDocs} documents completed successfully and available for review</p>
        </div>
        <div className="feature-card purple">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2v5M12 17v5M4.2 4.2l3.5 3.5M16.3 16.3l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </div>
          <h4>Top Categories</h4>
          <p>{topCategories.length ? topCategories.map(([name, count]) => `${name} (${count})`).join(', ') : 'No categories available yet'}</p>
        </div>
        <div className="feature-card green">
          <div className="feature-icon">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="m8 12 3 3 5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <h4>Queue Health</h4>
          <p>{processingDocs} processing and {failedDocs} failed documents in the current pipeline</p>
        </div>
      </section>

      <section className="doc-list">
        <div className="doc-list-head">
          <h3>Recent Documents</h3>
          <div className="pill-group">
            <button className="pill active" onClick={() => notify(`Showing ${totalDocs} documents.`)}>All Documents</button>
            <button className="pill" onClick={() => notify(`${failedDocs} failed documents found.`)}>Failed Only</button>
          </div>
        </div>
        {docs.map((doc) => {
          const status = String(doc.status || '').toLowerCase();
          const statusClass = status === 'processed' ? 'success' : status === 'failed' ? 'danger' : 'info';
          return (
            <div className="doc-item" key={doc.id}>
              <div className="doc-info">
                <span className={`doc-icon ${status === 'processing' ? 'neutral' : ''}`.trim()}>
                  <svg viewBox="0 0 24 24">
                    <path d="M6 3h9l3 3v15H6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M9 7h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M9 11h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <h4>{doc.name}</h4>
                  <p>{doc.category} • {doc.size || '--'} • {doc.timestamp || '--'}</p>
                </div>
              </div>
              <div className={`doc-status ${statusClass}`}>{doc.status || 'Unknown'}</div>
              <div className="doc-data">
                <div>
                  <span>Document ID</span>
                  <strong>{doc.id}</strong>
                </div>
                <div>
                  <span>Category</span>
                  <strong>{doc.category || '--'}</strong>
                </div>
                <div>
                  <span>Confidence</span>
                  <strong>{doc.confidence || '--'}</strong>
                </div>
                <div>
                  <span>Queue Status</span>
                  <strong>{doc.status || '--'}</strong>
                </div>
              </div>
              <div className="doc-actions">
                <span>Stored in document database • Last update: {doc.timestamp || recentTimestamp}</span>
                <div className="action-row">
                  <button type="button" onClick={() => handleView(doc)}>View</button>
                  <button type="button" onClick={() => handleDownload(doc)}>Download</button>
                  {status === 'failed' && (
                    <button type="button" onClick={() => notify(`Retry queued for ${doc.id}.`)}>Retry</button>
                  )}
                  <button className="danger" type="button" onClick={() => handleDelete(doc)}>Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="table-footer">
        <span>Showing {docs.length} of {totalDocs} documents • Latest update: {recentTimestamp}</span>
        <div className="pagination">
          <button className="page-btn" type="button" onClick={() => notify('Pagination is not wired yet.')}>Previous</button>
          <button className="page-btn active" type="button" onClick={() => notify('Pagination is not wired yet.')}>1</button>
          <button className="page-btn" type="button" onClick={() => notify('Pagination is not wired yet.')}>2</button>
          <button className="page-btn" type="button" onClick={() => notify('Pagination is not wired yet.')}>Next</button>
        </div>
      </section>
    </main>
  );
};

const AssistantContent = ({ onChat }) => {
  const initialMessages = [
    {
      id: 'bot-1',
      role: 'bot',
      content: (
        <p>
          Hello! I'm your InsurAI Assistant. Ask about policies, claims, risk analysis, or
          recommendations.
        </p>
      ),
      time: '09:00 AM'
    }
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const formatTime = (value) => {
    const date = value ? new Date(value) : new Date();
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async (text) => {
    const trimmed = String(text || '').trim();
    if (!trimmed) return;
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      time: formatTime()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);
    try {
      if (!onChat) {
        notify('Assistant backend is not connected.');
        return;
      }
      const reply = await onChat(trimmed);
      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        content: <p>{reply.text}</p>,
        time: formatTime(reply.timestamp)
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      notify(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const quickSend = (text) => handleSend(text);

  return (
    <main className="dash-main">
      <header className="dash-header">
        <div>
          <h1>AI Assistant</h1>
          <p>Natural language policy queries and intelligent recommendations</p>
        </div>
      </header>

      <section className="assistant-grid">
        <div className="assistant-left">
          <div className="card quick-actions">
            <div className="card-head">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-list">
              <button className="quick-item" type="button" onClick={() => quickSend('Show latest policy status updates.') }>
                <span className="quick-icon mint">
                  <svg viewBox="0 0 24 24">
                    <path d="M6 3h9l3 3v15H6z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M9 7h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                Policy Status
              </button>
              <button className="quick-item" type="button" onClick={() => quickSend('Provide a risk analysis summary for current portfolio.') }>
                <span className="quick-icon mint">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 16l5-5 4 4 7-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
                Risk Analysis
              </button>
              <button className="quick-item" type="button" onClick={() => quickSend('Run a compliance check for the latest policies.') }>
                <span className="quick-icon mint">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2 4 5v6c0 5.2 4 9.4 8 11 4-1.6 8-5.8 8-11V5l-8-3Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
                Compliance Check
              </button>
              <button className="quick-item" type="button" onClick={() => quickSend('Share AI insights and recommendations.') }>
                <span className="quick-icon mint">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2v5M12 17v5M4.2 4.2l3.5 3.5M16.3 16.3l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
                AI Insights
              </button>
            </div>
          </div>

          <div className="card performance">
            <div className="card-head">
              <h3>AI Performance</h3>
            </div>
            <div className="perf-item">
              <span>Response Accuracy</span>
              <strong>98.5%</strong>
              <div className="perf-bar"><span style={{ width: '98.5%' }} /></div>
            </div>
            <div className="perf-item">
              <span>Avg Response Time</span>
              <strong>1.2s</strong>
              <div className="perf-bar green"><span style={{ width: '72%' }} /></div>
            </div>
            <div className="perf-item">
              <span>User Satisfaction</span>
              <strong>96%</strong>
              <div className="perf-bar purple"><span style={{ width: '96%' }} /></div>
            </div>
          </div>

          <div className="card capabilities">
            <div className="card-head">
              <h3>AI Capabilities</h3>
            </div>
            <ul className="cap-list">
              <li>Natural language policy search</li>
              <li>Claims status tracking</li>
              <li>Risk assessment analysis</li>
              <li>Policy recommendations</li>
              <li>Compliance verification</li>
              <li>Fraud detection alerts</li>
            </ul>
          </div>
        </div>

        <div className="assistant-chat">
          <div className="chat-header">
            <div className="chat-title">
              <span className="chat-avatar">
                <svg viewBox="0 0 24 24">
                  <rect x="4" y="5" width="16" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M9 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <strong>InsurAI Assistant</strong>
                <span className="online">Online</span>
              </div>
            </div>
            <button className="ghost-action" type="button" onClick={() => setMessages(initialMessages)}>Clear Chat</button>
          </div>

          <div className="chat-body">
            {messages.map((msg) => (
              <div className={`chat-row ${msg.role === 'user' ? 'user' : ''}`} key={msg.id}>
                {msg.role === 'bot' && (
                  <span className="bot-icon">
                    <svg viewBox="0 0 24 24">
                      <rect x="4" y="5" width="16" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M9 18h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                )}
                <div className="chat-bubble">
                  {msg.content}
                  <span className="chat-time">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask me anything about policies, claims, or risk analysis..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSend(input);
                }
              }}
            />
            <button className="primary-btn" type="button" onClick={() => handleSend(input)} disabled={sending}>
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
          <p className="chat-footer">Powered by advanced AI â€¢ Responses are generated in real-time</p>
        </div>
      </section>
    </main>
  );
};
const AnalyticsContent = ({ analytics }) => {
  const summary = analytics?.summary || {
    revenue: 678000,
    activePolicies: 12847,
    pendingClaims: 342,
    newCustomers: 367
  };
  const revenueVsClaims = analytics?.revenueVsClaims || {
    months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    revenue: [480000, 500000, 540000, 592000, 630000, 680000],
    claims: [320000, 335000, 350000, 342000, 360000, 375000]
  };
  const claimsDistribution = analytics?.claimsDistribution || [
    { label: 'Health', value: 33 },
    { label: 'Life', value: 27 },
    { label: 'Auto', value: 22 },
    { label: 'Property', value: 18 }
  ];
  const customerGrowth = analytics?.customerGrowth || [
    { month: 'Aug', newCustomers: 52, churned: 8, net: 44 },
    { month: 'Sep', newCustomers: 58, churned: 10, net: 48 },
    { month: 'Oct', newCustomers: 61, churned: 11, net: 50 },
    { month: 'Nov', newCustomers: 65, churned: 12, net: 53 },
    { month: 'Dec', newCustomers: 73, churned: 13, net: 60 },
    { month: 'Jan', newCustomers: 84, churned: 14, net: 70 }
  ];
  const performance = analytics?.performance || [
    { label: 'Processing Speed', value: 82 },
    { label: 'Customer Satisfaction', value: 89 },
    { label: 'Accuracy', value: 91 },
    { label: 'Compliance', value: 87 },
    { label: 'Cost Efficiency', value: 78 },
    { label: 'Automation Rate', value: 85 }
  ];
  const topPolicies = analytics?.topPolicies || [
    { name: 'Health Insurance', policies: 4, revenue: 136000, delta: 13.6 },
    { name: 'Life Insurance', policies: 2, revenue: 90000, delta: 14.2 },
    { name: 'Property Insurance', policies: 1, revenue: 56000, delta: 10.9 }
  ];

  const chartWidth = 500;
  const chartHeight = 160;
  const maxSeriesValue = Math.max(
    ...revenueVsClaims.revenue.map((value) => Number(value) || 0),
    ...revenueVsClaims.claims.map((value) => Number(value) || 0),
    1
  );
  const toPolyline = (series) => series.map((value, index) => {
    const x = 10 + (index * (chartWidth / Math.max(1, series.length - 1)));
    const y = 20 + ((maxSeriesValue - (Number(value) || 0)) / maxSeriesValue) * chartHeight;
    return `${x},${y}`;
  }).join(' ');
  const latestIndex = Math.max(0, revenueVsClaims.months.length - 1);
  const latestMonth = revenueVsClaims.months[latestIndex] || '--';
  const latestRevenue = revenueVsClaims.revenue[latestIndex] || 0;
  const latestClaims = revenueVsClaims.claims[latestIndex] || 0;

  const pieColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#14b8a6'];
  const distributionTotal = claimsDistribution.reduce((sum, item) => sum + Number(item.value || 0), 0) || 1;
  let offset = 0;
  const pieGradient = `conic-gradient(${claimsDistribution.map((item, index) => {
    const start = offset;
    const portion = (Number(item.value || 0) / distributionTotal) * 100;
    offset += portion;
    return `${pieColors[index % pieColors.length]} ${start}% ${offset}%`;
  }).join(', ')})`;

  const growthMax = Math.max(
    ...customerGrowth.map((item) => Number(item.newCustomers || 0)),
    ...customerGrowth.map((item) => Number(item.churned || 0)),
    ...customerGrowth.map((item) => Number(item.net || 0)),
    1
  );

  const handleExport = () => {
    const payload = { summary, revenueVsClaims, claimsDistribution, customerGrowth, performance, topPolicies };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="dash-main">
      <header className="dash-header analytics-header">
        <div>
          <h1>Analytics & Reports</h1>
          <p>Comprehensive business intelligence and predictive analytics</p>
        </div>
        <div className="analytics-actions">
          <select className="filter-select">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Year to Date</option>
          </select>
          <button className="filter-btn" type="button" onClick={() => notify('Analytics filters are coming soon.')}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            Filters
          </button>
          <button className="primary-btn" type="button" onClick={handleExport}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M5 19h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Export Report
          </button>
        </div>
      </header>

      <section className="stat-grid">
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon green">
              <svg viewBox="0 0 24 24">
                <path d="M12 2v20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M7 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stat-change up">Live</span>
          </div>
          <h3>${Math.round((summary.revenue || 0) / 1000)}K</h3>
          <p>Total Revenue</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon mint">
              <svg viewBox="0 0 24 24">
                <circle cx="9" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M3 21c1.5-4 10.5-4 12 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <span className="stat-change up">Live</span>
          </div>
          <h3>{Number(summary.activePolicies || 0).toLocaleString()}</h3>
          <p>Active Policies</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon purple">
              <svg viewBox="0 0 24 24">
                <path d="M3 12h4l2-4 4 10 2-6h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stat-change up">Live</span>
          </div>
          <h3>{Number(summary.pendingClaims || 0).toLocaleString()}</h3>
          <p>Pending Claims</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon orange">
              <svg viewBox="0 0 24 24">
                <rect x="4" y="3" width="16" height="18" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M8 7h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stat-change up">Live</span>
          </div>
          <h3>{Number(summary.newCustomers || 0).toLocaleString()}</h3>
          <p>New Customers</p>
        </div>
      </section>

      <section className="dash-grid two">
        <div className="card">
          <div className="card-head">
            <h3>Revenue vs Claims Analysis</h3>
          </div>
          <div className="line-chart dual">
            <svg viewBox="0 0 560 220" aria-hidden="true">
              <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="claimFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline points={toPolyline(revenueVsClaims.revenue)} fill="none" stroke="#3b82f6" strokeWidth="3" />
              <polygon points={`10,220 ${toPolyline(revenueVsClaims.revenue)} 510,220`} fill="url(#revFill)" />
              <polyline points={toPolyline(revenueVsClaims.claims)} fill="none" stroke="#ef4444" strokeWidth="2" />
              <polygon points={`10,220 ${toPolyline(revenueVsClaims.claims)} 510,220`} fill="url(#claimFill)" />
            </svg>
            <div className="line-overlay">
              <div>
                <strong>{latestMonth}</strong>
                <span className="rev">Revenue : {Math.round(Number(latestRevenue || 0)).toLocaleString()}</span>
                <span className="claim">Claims : {Math.round(Number(latestClaims || 0)).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="legend">
            <span className="dot approved" /> Revenue
            <span className="dot rejected" /> Claims
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Claims Distribution</h3>
          </div>
          <div className="pie-wrap">
            <div className="pie" style={{ background: pieGradient }} />
            <div className="pie-legend">
              {claimsDistribution.map((item, index) => (
                <span className="legend-item" key={item.label} style={{ color: pieColors[index % pieColors.length] }}>
                  {item.label}: {Math.round((Number(item.value || 0) / distributionTotal) * 100)}%
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="dash-grid two">
        <div className="card">
          <div className="card-head">
            <h3>Customer Growth Trends</h3>
          </div>
          <div className="bar-chart growth">
            <div className="bar-grid">
              <span>{Math.round(growthMax)}</span>
              <span>{Math.round(growthMax * 0.75)}</span>
              <span>{Math.round(growthMax * 0.5)}</span>
              <span>{Math.round(growthMax * 0.25)}</span>
            </div>
            <div className="bar-series">
              {customerGrowth.map((item) => (
                <div className="bar-group" key={item.month}>
                  <div className="bar new" style={{ height: `${(Number(item.newCustomers || 0) / growthMax) * 100}%` }} />
                  <div className="bar churned" style={{ height: `${(Number(item.churned || 0) / growthMax) * 100}%` }} />
                  <div className="bar net" style={{ height: `${(Number(item.net || 0) / growthMax) * 100}%` }} />
                  <span>{item.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="legend growth">
            <span className="dot new" /> New Customers
            <span className="dot churned" /> Churned
            <span className="dot net" /> Net Growth
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Operational Performance</h3>
          </div>
          <div className="performance-list">
            {performance.map((item) => (
              <div className="perf-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{Math.round(Number(item.value || 0))}%</strong>
                <div className="perf-bar">
                  <span style={{ width: `${Math.max(4, Math.min(100, Number(item.value || 0)))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>Top Performing Policies</h3>
        </div>
        <div className="top-policies">
          {topPolicies.map((card, index) => (
            <div className="mini-card policy-card" key={`${card.name}-${index}`}>
              <div className="policy-head">
                <span>#{index + 1}</span>
                <span className="text-green">+{Math.round(Number(card.delta || 0))}%</span>
              </div>
              <h4>{card.name}</h4>
              <div className="policy-meta">
                <span>Policies</span>
                <strong>{Number(card.policies || 0).toLocaleString()}</strong>
              </div>
              <div className="policy-meta">
                <span>Revenue</span>
                <strong>${Math.round(Number(card.revenue || 0)).toLocaleString()}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

const RiskContent = ({ risk }) => {
  const portfolioRiskScore = risk?.portfolioRiskScore ?? 5.8;
  const riskTrend = risk?.riskTrend ?? -6.9;
  const aiConfidence = risk?.aiConfidence ?? 96.3;
  const categories = risk?.categories || [
    { name: 'Financial Risk', score: 6.8 },
    { name: 'Health Risk', score: 4.2 },
    { name: 'Property Risk', score: 7.5 },
    { name: 'Auto Risk', score: 5.3 },
    { name: 'Life Risk', score: 3.9 },
    { name: 'Fraud Risk', score: 2.8 }
  ];
  const insights = risk?.insights || [
    { title: 'Claim Probability Increase', detail: '23% higher likelihood of claims in coastal properties next quarter', confidence: '94%', level: 'high' },
    { title: 'Portfolio Risk Reduction', detail: 'Current strategies will reduce overall risk by 12% in 6 months', confidence: '87%', level: 'low' },
    { title: 'Market Volatility Alert', detail: 'Auto insurance claims expected to spike due to seasonal factors', confidence: '91%', level: 'medium' }
  ];
  const factorAnalysis = risk?.factorAnalysis || [
    { label: 'Claims Frequency', value: 78 },
    { label: 'Customer Age', value: 61 },
    { label: 'Coverage Amount', value: 73 },
    { label: 'Location Risk', value: 84 },
    { label: 'Payment History', value: 67 },
    { label: 'Policy Duration', value: 58 }
  ];
  const trendComparison = risk?.trendComparison || [
    { month: 'Nov', portfolio: 5.4, industry: 6.2 },
    { month: 'Dec', portfolio: 5.5, industry: 6.2 },
    { month: 'Jan', portfolio: 5.6, industry: 6.3 },
    { month: 'Feb', portfolio: 5.7, industry: 6.3 },
    { month: 'Mar', portfolio: 5.8, industry: 6.4 },
    { month: 'Apr', portfolio: 5.8, industry: 6.6 }
  ];
  const highRiskPolicies = risk?.highRiskPolicies || [
    {
      score: '8.7',
      name: 'John Martinez',
      policy: 'POL-2024-087 • Property Insurance',
      factors: ['High claim history', 'High-risk location', 'Large coverage'],
      rec: 'Increase premium by 15%'
    },
    {
      score: '8.2',
      name: 'Emma Thompson',
      policy: 'POL-2024-142 • Auto Insurance',
      factors: ['Multiple accidents', 'DUI record', 'Young driver'],
      rec: 'Add telematics and increase deductible'
    }
  ];

  const latestTrend = trendComparison[trendComparison.length - 1] || { month: '--', portfolio: portfolioRiskScore, industry: portfolioRiskScore + 1 };
  const [activeTrend, setActiveTrend] = useState(latestTrend);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const trendValues = [
    ...trendComparison.map((item) => Number(item.portfolio || 0)),
    ...trendComparison.map((item) => Number(item.industry || 0))
  ];
  const rawTrendMin = Math.min(...trendValues, portfolioRiskScore, latestTrend?.industry || 0);
  const rawTrendMax = Math.max(...trendValues, portfolioRiskScore, latestTrend?.industry || 0, 1);
  const trendPadding = Math.max(0.4, (rawTrendMax - rawTrendMin) * 0.35);
  const trendMin = Math.max(0, rawTrendMin - trendPadding);
  const trendMax = rawTrendMax + trendPadding;
  const lineWidth = 500;
  const lineHeight = 130;
  const chartTop = 30;
  const toRiskPolyline = (seriesKey) => trendComparison.map((item, index) => {
    const x = 10 + (index * (lineWidth / Math.max(1, trendComparison.length - 1)));
    const y = chartTop + ((trendMax - Number(item[seriesKey] || 0)) / Math.max(0.1, trendMax - trendMin)) * lineHeight;
    return `${x},${y}`;
  }).join(' ');
  const trendPoints = trendComparison.map((item, index) => {
    const x = 10 + (index * (lineWidth / Math.max(1, trendComparison.length - 1)));
    const portfolioY = chartTop + ((trendMax - Number(item.portfolio || 0)) / Math.max(0.1, trendMax - trendMin)) * lineHeight;
    const industryY = chartTop + ((trendMax - Number(item.industry || 0)) / Math.max(0.1, trendMax - trendMin)) * lineHeight;
    return { ...item, x, portfolioY, industryY };
  });
  useEffect(() => {
    setActiveTrend(latestTrend);
  }, [latestTrend.month, latestTrend.portfolio, latestTrend.industry]);

  const getReviewDecision = (row) => {
    const score = Number.parseFloat(String(row?.score || '0'));
    const recommendation = String(row?.rec || '').toLowerCase();

    if (score >= 7 || recommendation.includes('decline') || recommendation.includes('reject')) {
      return {
        verdict: 'Do Not Auto-Approve',
        tone: 'danger',
        summary: 'This policy should not be approved automatically. A senior reviewer should inspect coverage, claim volatility, and supporting documents first.'
      };
    }
    if (score >= 5 || recommendation.includes('review')) {
      return {
        verdict: 'Manual Review Required',
        tone: 'warning',
        summary: 'This policy may still proceed, but it should be reviewed manually before approval because the risk signals are elevated.'
      };
    }
    return {
      verdict: 'Safe To Approve',
      tone: 'success',
      summary: 'Current risk indicators are acceptable for approval. A normal approval flow should be sufficient.'
    };
  };

  const activeDecision = selectedPolicy ? getReviewDecision(selectedPolicy) : null;

  return (
    <main className="dash-main">
      <header className="dash-header">
        <div>
          <h1>AI Risk Assessment</h1>
          <p>Predictive risk analysis and intelligent portfolio management</p>
        </div>
      </header>

      <section className="risk-hero">
        <div className="risk-hero-item">
          <span className="risk-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2 4 5v6c0 5.2 4 9.4 8 11 4-1.6 8-5.8 8-11V5l-8-3Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <div>
            <p>Portfolio Risk Score</p>
            <h2>{portfolioRiskScore}/10</h2>
            <span>{riskTrend >= 0 ? 'Risk is tracking below industry average' : 'Risk trend needs closer monitoring'}</span>
          </div>
        </div>
        <div className="risk-hero-item">
          <span className="risk-icon">
            <svg viewBox="0 0 24 24">
              <path d="M4 7l6 6 4-4 6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <p>Risk Trend</p>
            <h2>{riskTrend}%</h2>
            <span>{riskTrend >= 0 ? 'Portfolio improving against baseline' : 'Risk pressure is increasing'}</span>
          </div>
        </div>
        <div className="risk-hero-item">
          <span className="risk-icon">
            <svg viewBox="0 0 24 24">
              <path d="M9 4h6M12 4v16M6 12h12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div>
            <p>AI Confidence</p>
            <h2>{aiConfidence}%</h2>
            <span>Confidence based on live policy, claim, and document signals</span>
          </div>
        </div>
      </section>

      <section className="risk-cards">
        {categories.map((card) => {
          const value = Math.round((card.score / 10) * 100);
          const color = card.score >= 7 ? 'red' : card.score >= 4 ? 'amber' : 'green';
          const trend = card.score >= 6 ? 'up' : 'down';
          return (
            <div className="risk-card" key={card.name || card.title}>
              <div className="risk-card-head">
                <h4>{card.name || card.title}</h4>
                <span className={`trend ${trend}`}>{trend === 'up' ? '↗' : '↘'}</span>
              </div>
              <div className={`risk-score ${color}`}>{card.score}/10</div>
              <div className="risk-bar">
                <span className={color} style={{ width: `${value}%` }} />
              </div>
            </div>
          );
        })}
      </section>

      <section className="dash-grid two">
        <div className="card">
          <div className="card-head">
            <h3>Risk Factor Analysis</h3>
          </div>
          <div className="performance-list">
            {factorAnalysis.map((item) => (
              <div className="perf-item" key={item.label}>
                <span>{item.label}</span>
                <strong>{Math.round(Number(item.value || 0))}%</strong>
                <div className="perf-bar">
                  <span style={{ width: `${Math.max(4, Math.min(100, Number(item.value || 0)))}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Risk Trend Comparison</h3>
          </div>
          <div className="line-chart dual">
            <svg viewBox="0 0 560 220" aria-hidden="true">
              {[0, 1, 2, 3].map((step) => {
                const y = chartTop + (step * (lineHeight / 3));
                return <line key={step} x1="10" y1={y} x2="510" y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 6" />;
              })}
              <polyline points={toRiskPolyline('portfolio')} fill="none" stroke="#3b82f6" strokeWidth="3" />
              <polyline points={toRiskPolyline('industry')} fill="none" stroke="#9ca3af" strokeWidth="2" strokeDasharray="6 6" />
              {trendPoints.map((point) => (
                <g
                  key={point.month}
                  onMouseEnter={() => setActiveTrend(point)}
                  onMouseLeave={() => setActiveTrend(latestTrend)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect
                    x={point.x - 28}
                    y={chartTop - 10}
                    width="56"
                    height={lineHeight + 40}
                    fill="transparent"
                  />
                  <circle cx={point.x} cy={point.portfolioY} r="4.5" fill="#3b82f6" />
                  <circle cx={point.x} cy={point.industryY} r="3.5" fill="#94a3b8" />
                  <text x={point.x} y="190" textAnchor="middle" fontSize="11" fill="#64748b">{point.month}</text>
                </g>
              ))}
            </svg>
            <div className="line-overlay">
              <div>
                <strong>{activeTrend.month}</strong>
                <span className="rev">Portfolio : {Number(activeTrend.portfolio || 0).toFixed(1)}/10</span>
                <span className="claim">Industry : {Number(activeTrend.industry || 0).toFixed(1)}/10</span>
              </div>
            </div>
            <div className="legend">
              <span className="dot net" /> Your Portfolio
              <span className="dot pending" /> Industry Average
            </div>
          </div>
        </div>
      </section>

      <section className="card risk-insights">
        <div className="card-head">
          <h3>AI Predictive Insights</h3>
        </div>
        <div className="insight-grid">
          {insights.map((item) => {
            const tone = item.level === 'high' ? 'danger' : item.level === 'medium' ? 'warning' : 'success';
            return (
              <div className={`insight-chip ${tone}`} key={item.title}>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
                <span>Confidence: {item.confidence}</span>
                <span className={`pill ${tone}`}>{item.level}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>High Risk Policies Requiring Attention</h3>
        </div>
        {highRiskPolicies.map((row) => (
          <div className="risk-alert" key={row.name}>
            <div className="alert-score">{row.score}</div>
            <div className="alert-info">
              <h4>{row.name}</h4>
              <p>{row.policy}</p>
              <div className="factor-row">
                {row.factors.map((factor) => (
                  <span className="factor-pill" key={factor}>{factor}</span>
                ))}
              </div>
              <div className="alert-rec">
                <span>AI Recommendation:</span> {row.rec}
              </div>
            </div>
            <button className="primary-btn" type="button" onClick={() => setSelectedPolicy(row)}>Review Policy</button>
          </div>
        ))}
      </section>

      {selectedPolicy && activeDecision && (
        <div className="review-modal-backdrop" onClick={() => setSelectedPolicy(null)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-head">
              <div>
                <h3>{selectedPolicy.name}</h3>
                <p>{selectedPolicy.policy}</p>
              </div>
              <button className="ghost-action" type="button" onClick={() => setSelectedPolicy(null)}>Close</button>
            </div>
            <div className="review-modal-grid">
              <div className="review-card">
                <span>Risk Score</span>
                <strong>{selectedPolicy.score}/10</strong>
              </div>
              <div className="review-card">
                <span>AI Recommendation</span>
                <strong>{selectedPolicy.rec}</strong>
              </div>
              <div className={`review-card verdict ${activeDecision.tone}`}>
                <span>Approval Decision</span>
                <strong>{activeDecision.verdict}</strong>
              </div>
            </div>
            <div className="review-summary">
              <h4>Assessment</h4>
              <p>{activeDecision.summary}</p>
            </div>
            <div className="review-summary">
              <h4>Risk Factors</h4>
              <div className="factor-row">
                {selectedPolicy.factors.map((factor) => (
                  <span className="factor-pill" key={factor}>{factor}</span>
                ))}
              </div>
            </div>
            <div className="review-actions">
              <button className="ghost-action" type="button" onClick={() => setSelectedPolicy(null)}>Close</button>
              <button className="primary-btn" type="button" onClick={() => notify(`${activeDecision.verdict} for ${selectedPolicy.policy}`)}>Use Decision</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
const FraudContent = ({ fraud, onClaimDecision }) => {
  const summary = fraud?.summary || {
    casesDetected: 847,
    amountSaved: 2400000,
    detectionRate: 94.2,
    falsePositives: 3.8
  };
  const trends = fraud?.trends || {
    months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    detected: [65, 72, 85, 78, 91, 104],
    prevented: [60, 68, 80, 74, 87, 98]
  };
  const types = fraud?.types || [
    { label: 'Exaggerated Claims', value: 40 },
    { label: 'False Information', value: 29 },
    { label: 'Duplicate Claims', value: 18 },
    { label: 'Staged Accidents', value: 12 }
  ];
  const indicators = fraud?.indicators || [
    { title: 'Claim Pattern Anomaly', level: 'High', description: 'Multiple claims in short timeframe', count: '234 cases' },
    { title: 'Document Inconsistency', level: 'Critical', description: 'Mismatched or altered documents', count: '189 cases' },
    { title: 'Behavioral Red Flags', level: 'Medium', description: 'Suspicious communication patterns', count: '167 cases' },
    { title: 'Network Analysis', level: 'High', description: 'Connected suspicious parties', count: '142 cases' }
  ];
  const investigations = fraud?.investigations || [
    {
      score: '92',
      name: 'David Thompson',
      caseId: 'FR-2024-0842',
      claim: 'CL-2024-2850',
      type: 'Auto Insurance',
      amount: '$3,200',
      status: 'investigating',
      confidence: '94%',
      flags: ['Multiple claims in 6 months', 'Inconsistent accident report', 'Rushed claim submission']
    },
    {
      score: '87',
      name: 'Maria Garcia',
      caseId: 'FR-2024-0843',
      claim: 'CL-2024-2859',
      type: 'Property Insurance',
      amount: '$15,800',
      status: 'investigating',
      confidence: '89%',
      flags: ['Damage inconsistent with report', 'New policy holder', 'High-value items']
    },
    {
      score: '79',
      name: 'Robert Lee',
      caseId: 'FR-2024-0844',
      claim: 'CL-2024-2861',
      type: 'Health Insurance',
      amount: '$8,500',
      status: 'reviewing',
      confidence: '82%',
      flags: ['Provider relationship suspicious', 'Unusual treatment pattern']
    }
  ];
  const resolvedInvestigations = fraud?.resolvedInvestigations || [];
  const [fraudSearch, setFraudSearch] = useState('');
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [decisionLoadingId, setDecisionLoadingId] = useState('');
  const filteredInvestigations = investigations.filter((item) => {
    const query = fraudSearch.trim().toLowerCase();
    if (!query) return true;
    const haystack = [
      item.name,
      item.caseId,
      item.claim,
      item.type,
      ...(item.flags || [])
    ].join(' ').toLowerCase();
    return haystack.includes(query);
  });
  const trendMax = Math.max(
    ...trends.detected.map((value) => Number(value || 0)),
    ...trends.prevented.map((value) => Number(value || 0)),
    1
  );
  const fraudPieColors = ['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#14b8a6'];
  const rawTypeTotal = types.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const typeTotal = rawTypeTotal || 1;
  const normalizedTypes = types.map((item) => ({
    ...item,
    percent: ((Number(item.value || 0) / typeTotal) * 100)
  }));
  const hasFraudTrendData = trends.months.some((_, idx) => Number(trends.detected[idx] || 0) > 0 || Number(trends.prevented[idx] || 0) > 0);
  const hasFraudTypeData = rawTypeTotal > 0;
  let typeOffset = 0;
  const fraudPie = `conic-gradient(${normalizedTypes.map((item, index) => {
    const start = typeOffset;
    const portion = item.percent;
    typeOffset += portion;
    return `${fraudPieColors[index % fraudPieColors.length]} ${start}% ${typeOffset}%`;
  }).join(', ')})`;

  const handleDecision = async (item, status) => {
    if (!onClaimDecision) {
      notify('Claim action is not connected.');
      return;
    }
    setDecisionLoadingId(item.claim);
    try {
      await onClaimDecision(item.claim, {
        status,
        processing: status === 'Approved' ? 'Auto-approved by fraud review' : 'Denied after fraud review'
      });
      if (selectedInvestigation?.claim === item.claim) {
        setSelectedInvestigation(null);
      }
      notify(`${item.claim} updated to ${status}.`);
    } catch (err) {
      notify(err.message || `Failed to mark ${item.claim} as ${status}.`);
    } finally {
      setDecisionLoadingId('');
    }
  };

  const handleEscalate = async (item) => {
    if (!onClaimDecision) {
      notify('Claim action is not connected.');
      return;
    }
    setDecisionLoadingId(item.claim);
    try {
      await onClaimDecision(item.claim, {
        status: 'Reviewing',
        processing: 'Escalated for fraud investigation'
      });
      if (selectedInvestigation?.claim === item.claim) {
        setSelectedInvestigation(null);
      }
      notify(`${item.claim} moved back to active investigation.`);
    } catch (err) {
      notify(err.message || `Failed to escalate ${item.claim}.`);
    } finally {
      setDecisionLoadingId('');
    }
  };

  return (
    <main className="dash-main">
      <header className="dash-header">
        <div>
          <h1>Fraud Detection System</h1>
          <p>AI-powered fraud detection with real-time monitoring and analysis</p>
        </div>
      </header>

      <section className="stat-grid">
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon danger">
              <svg viewBox="0 0 24 24">
                <path d="M3 12h4l2-4 4 10 2-6h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stat-change up">Live</span>
          </div>
          <h3>{Number(summary.casesDetected || 0).toLocaleString()}</h3>
          <p>Cases Detected</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon danger">
              <svg viewBox="0 0 24 24">
                <path d="M12 2v20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M7 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stat-change up">Live</span>
          </div>
          <h3>${(Number(summary.amountSaved || 0) / 1000000).toFixed(1)}M</h3>
          <p>Amount Saved</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon danger">
              <svg viewBox="0 0 24 24">
                <path d="M3 12h4l2-4 4 10 2-6h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stat-change up">Live</span>
          </div>
          <h3>{Number(summary.detectionRate || 0)}%</h3>
          <p>Detection Rate</p>
        </div>
        <div className="stat-card">
          <div className="stat-head">
            <span className="stat-icon danger">
              <svg viewBox="0 0 24 24">
                <path d="M3 12h4l2-4 4 10 2-6h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="stat-change down">Live</span>
          </div>
          <h3>{Number(summary.falsePositives || 0)}%</h3>
          <p>False Positives</p>
        </div>
      </section>

      <section className="fraud-hero">
        <div className="fraud-hero-left">
          <span className="fraud-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2 4 5v6c0 5.2 4 9.4 8 11 4-1.6 8-5.8 8-11V5l-8-3Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <div>
            <h3>Active Fraud Monitoring</h3>
            <p>{summary.activeInvestigations ?? 12} suspicious cases under investigation • AI confidence: {summary.monitoringConfidence ?? 91}%</p>
          </div>
        </div>
        <div className="fraud-hero-right">
          <strong>${(summary.amountSaved / 1000000).toFixed(1)}M</strong>
          <span>Prevented this year</span>
        </div>
      </section>

      <section className="dash-grid two">
        <div className="card">
          <div className="card-head">
            <h3>Fraud Detection Trends</h3>
          </div>
          {hasFraudTrendData ? (
            <>
              <div className="bar-chart fraud-trends">
                <div className="bar-grid">
                  <span>{Math.round(trendMax)}</span>
                  <span>{Math.round(trendMax * 0.75)}</span>
                  <span>{Math.round(trendMax * 0.5)}</span>
                  <span>{Math.round(trendMax * 0.25)}</span>
                </div>
                <div className="bar-series">
                  {trends.months.map((label, idx) => (
                    <div className="bar-group" key={label}>
                      <div className="bar-stack">
                        <div className="bar-value">{Number(trends.detected[idx] || 0)}</div>
                        <div className="bar detected" style={{ height: `${Math.max(8, (Number(trends.detected[idx] || 0) / trendMax) * 140)}px` }} />
                        <div className="bar-value muted">{Number(trends.prevented[idx] || 0)}</div>
                        <div className="bar prevented" style={{ height: `${Math.max(8, (Number(trends.prevented[idx] || 0) / trendMax) * 140)}px` }} />
                      </div>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="legend">
                <span className="dot detected" /> Detected
                <span className="dot prevented" /> Prevented
              </div>
            </>
          ) : (
            <div className="empty-state">No fraud cases are active right now, so there is no trend data to plot yet.</div>
          )}
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Fraud Types</h3>
          </div>
          {hasFraudTypeData ? (
            <div className="pie-wrap">
              <div className="pie" style={{ background: fraudPie }} />
              <div className="pie-legend">
                {normalizedTypes.map((t, index) => (
                  <span className="legend-item" key={t.label} style={{ color: fraudPieColors[index % fraudPieColors.length] }}>
                    {t.label}: {t.percent.toFixed(1)}%
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state">No active fraud categories to break down. This chart will update as soon as cases are flagged.</div>
          )}
        </div>
      </section>

      <section className="card indicators">
        <div className="card-head">
          <h3>AI Detection Indicators</h3>
        </div>
        <div className="indicator-grid">
          {indicators.map((item) => {
            const tone = item.level === 'Critical' ? 'danger' : 'warning';
            return (
              <div className="indicator-card" key={item.title}>
                <div className="indicator-head">
                  <h4>{item.title}</h4>
                  <span className={`pill ${tone}`}>{item.level}</span>
                </div>
                <p>{item.description}</p>
                <div className="indicator-footer">
                  <span>Detected:</span>
                  <strong>{item.count}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="claims-search fraud-search">
        <div className="search-field">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search suspicious cases by ID, claimant, or claim..."
            value={fraudSearch}
            onChange={(e) => setFraudSearch(e.target.value)}
          />
        </div>
        <button className="filter-btn" type="button" onClick={() => notify('Fraud filters are coming soon.')}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          Filters
        </button>
      </section>

      <section className="card">
        <div className="card-head">
          <h3>Active Investigations</h3>
        </div>
        {filteredInvestigations.map((item) => (
          <div className="investigation" key={item.caseId}>
            <div className="investigation-score">
              <strong>{item.score}</strong>
              <span>Score</span>
            </div>
            <div className="investigation-info">
              <div className="investigation-head">
                <h4>{item.name}</h4>
                <div className="investigation-amount">
                  <strong>{item.amount}</strong>
                  <span className="pill warning">{item.status}</span>
                </div>
              </div>
              <div className="investigation-meta">
                <span className="meta-pill">Case: {item.caseId}</span>
                <span className="meta-pill">Claim: {item.claim}</span>
                <span className="meta-pill">{item.type}</span>
              </div>
              <div className="flag-row">
                {item.flags.map((flag) => (
                  <span className="flag-pill" key={flag}>{flag}</span>
                ))}
              </div>
              <div className="confidence-row">
                <span>AI Confidence: {item.confidence}</span>
                <div className="confidence-bar">
                  <span style={{ width: item.confidence }} />
                </div>
              </div>
            </div>
            <div className="investigation-actions">
              <button type="button" onClick={() => setSelectedInvestigation(item)}>View Details</button>
              <button
                className="deny"
                type="button"
                disabled={decisionLoadingId === item.claim}
                onClick={() => handleDecision(item, 'Denied')}
              >
                {decisionLoadingId === item.claim ? 'Saving...' : 'Deny Claim'}
              </button>
              <button
                className="approve"
                type="button"
                disabled={decisionLoadingId === item.claim}
                onClick={() => handleDecision(item, 'Approved')}
              >
                {decisionLoadingId === item.claim ? 'Saving...' : 'Approve'}
              </button>
            </div>
          </div>
        ))}
        {!filteredInvestigations.length && (
          <div className="empty-state">No investigation matches your search.</div>
        )}
      </section>

      <section className="card">
        <div className="card-head">
          <h3>Resolved Cases</h3>
        </div>
        {resolvedInvestigations.length ? (
          resolvedInvestigations.map((item) => (
            <div className="investigation resolved" key={`resolved-${item.caseId}`}>
              <div className="investigation-score resolved-score">
                <strong>{item.score}</strong>
                <span>Score</span>
              </div>
              <div className="investigation-info">
                <div className="investigation-head">
                  <h4>{item.name}</h4>
                  <div className="investigation-amount">
                    <strong>{item.amount}</strong>
                    <span className={`pill ${String(item.status).toLowerCase().includes('denied') ? 'danger' : 'success'}`}>{item.status}</span>
                  </div>
                </div>
                <div className="investigation-meta">
                  <span className="meta-pill">Case: {item.caseId}</span>
                  <span className="meta-pill">Claim: {item.claim}</span>
                  <span className="meta-pill">{item.type}</span>
                </div>
                <div className="flag-row">
                  {item.flags.map((flag) => (
                    <span className="flag-pill" key={flag}>{flag}</span>
                  ))}
                </div>
                <div className="confidence-row">
                  <span>AI Confidence: {item.confidence}</span>
                  <div className="confidence-bar">
                    <span style={{ width: item.confidence }} />
                  </div>
                </div>
                <p className="resolved-note">{item.processing}</p>
              </div>
              <div className="investigation-actions">
                <button type="button" onClick={() => setSelectedInvestigation(item)}>View Details</button>
                <button
                  className="ghost-action"
                  type="button"
                  disabled={decisionLoadingId === item.claim}
                  onClick={() => handleEscalate(item)}
                >
                  {decisionLoadingId === item.claim ? 'Saving...' : 'Reopen Investigation'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">No fraud cases have been resolved yet.</div>
        )}
      </section>

      {selectedInvestigation && (
        <div className="review-modal-backdrop" onClick={() => setSelectedInvestigation(null)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="review-modal-head">
              <div>
                <h3>{selectedInvestigation.name}</h3>
                <p>{selectedInvestigation.caseId} - {selectedInvestigation.claim}</p>
              </div>
              <button className="ghost-action" type="button" onClick={() => setSelectedInvestigation(null)}>Close</button>
            </div>
            <div className="review-modal-grid">
              <div className="review-card">
                <span>Fraud Score</span>
                <strong>{selectedInvestigation.score}</strong>
              </div>
              <div className="review-card">
                <span>Claim Type</span>
                <strong>{selectedInvestigation.type}</strong>
              </div>
              <div className={`review-card verdict ${Number(selectedInvestigation.score || 0) >= 90 ? 'danger' : 'warning'}`}>
                <span>Recommended Action</span>
                <strong>{Number(selectedInvestigation.score || 0) >= 90 ? 'Investigate Deeply' : 'Manual Review'}</strong>
              </div>
            </div>
            <div className="review-summary">
              <h4>Case Summary</h4>
              <p>
                This case is flagged because the fraud score is {selectedInvestigation.score} and the AI confidence is {selectedInvestigation.confidence}.
                Review the claim amount of {selectedInvestigation.amount} and validate the flagged patterns before approval.
              </p>
            </div>
            <div className="review-summary">
              <h4>Flags</h4>
              <div className="flag-row">
                {selectedInvestigation.flags.map((flag) => (
                  <span className="flag-pill" key={flag}>{flag}</span>
                ))}
              </div>
            </div>
            <div className="review-actions">
              <button className="ghost-action" type="button" onClick={() => setSelectedInvestigation(null)}>Close</button>
              <button
                className="deny"
                type="button"
                disabled={decisionLoadingId === selectedInvestigation.claim}
                onClick={() => handleEscalate(selectedInvestigation)}
              >
                Escalate
              </button>
              <button
                className="approve"
                type="button"
                disabled={decisionLoadingId === selectedInvestigation.claim}
                onClick={() => handleDecision(selectedInvestigation, 'Approved')}
              >
                Approve Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

const Dashboard = ({
  activePage,
  onNavigate,
  data,
  onCreatePolicy,
  onUpdatePolicy,
  onDeletePolicy,
  onCreateClaim,
  onUpdateClaim,
  onDeleteClaim,
  onGenerateClaimAi,
  onCreateDocument,
  onUploadDocument,
  onClassifyDocument,
  onDownloadDocument,
  onAssistantChat,
  onDeleteDocument,
  onGeneratePolicyAi
}) => {
  return (
    <div className="dashboard">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      {activePage === 'policies' ? (
        <PoliciesContent
          policies={data.policies}
          onCreate={onCreatePolicy}
          onGenerateAi={onGeneratePolicyAi}
          onUpdate={onUpdatePolicy}
          onDelete={onDeletePolicy}
        />
      ) : activePage === 'claims' ? (
        <ClaimsContent
          claims={data.claims}
          onCreate={onCreateClaim}
          onUpdate={onUpdateClaim}
          onDelete={onDeleteClaim}
          onGenerateAi={onGenerateClaimAi}
        />
      ) : activePage === 'documents' ? (
        <DocumentsContent
          documents={data.documents}
          onCreate={onCreateDocument}
          onDelete={onDeleteDocument}
          onUpload={onUploadDocument}
          onClassify={onClassifyDocument}
          onDownload={onDownloadDocument}
        />
      ) : activePage === 'assistant' ? (
        <AssistantContent onChat={onAssistantChat} />
      ) : activePage === 'risk' ? (
        <RiskContent risk={data.risk} />
      ) : activePage === 'fraud' ? (
        <FraudContent fraud={data.fraud} onClaimDecision={onUpdateClaim} />
      ) : (
        <DashboardContent data={data} onNavigate={onNavigate} />
      )}
    </div>
  );
};

const App = () => {
  const [token, setToken] = useState('');
  const [loggedIn, setLoggedIn] = useState(Boolean(token));
  const [activePage, setActivePage] = useState('dashboard');
  const [data, setData] = useState({
    policies: [],
    claims: [],
    documents: [],
    risk: null,
    fraud: null
  });

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const [policies, claims, documents, risk, fraud] = await Promise.all([
          apiRequest('/policies', {}, token),
          apiRequest('/claims', {}, token),
          apiRequest('/documents', {}, token),
          apiRequest('/risk', {}, token),
          apiRequest('/fraud', {}, token)
        ]);
        setData({ policies, claims, documents, risk, fraud });
      } catch (err) {
        // If token expired, force logout
        if (String(err.message || '').toLowerCase().includes('token')) {
          setToken('');
          setLoggedIn(false);
        }
      }
    };
    load();
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
    setLoggedIn(true);
  };

  const handleCreatePolicy = async (payload) => {
    const created = await apiRequest('/policies', {
      method: 'POST',
      body: JSON.stringify(payload)
    }, token);
    setData((prev) => ({ ...prev, policies: [created, ...prev.policies] }));
    return created;
  };

  const handleUpdatePolicy = async (id, payload) => {
    const updated = await apiRequest(`/policies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }, token);
    setData((prev) => ({
      ...prev,
      policies: prev.policies.map((policy) => (policy.id === id ? updated : policy))
    }));
    return updated;
  };

  const handleDeletePolicy = async (id) => {
    await apiRequest(`/policies/${id}`, { method: 'DELETE' }, token);
    setData((prev) => ({
      ...prev,
      policies: prev.policies.filter((policy) => policy.id !== id)
    }));
  };

  const handleCreateClaim = async (payload) => {
    const created = await apiRequest('/claims', {
      method: 'POST',
      body: JSON.stringify(payload)
    }, token);
    setData((prev) => ({ ...prev, claims: [created, ...prev.claims] }));
    return created;
  };

  const handleUpdateClaim = async (id, payload) => {
    const updated = await apiRequest(`/claims/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }, token);
    const refreshedFraud = await apiRequest('/fraud', {}, token);
    setData((prev) => ({
      ...prev,
      claims: prev.claims.map((claim) => (claim.id === id ? updated : claim)),
      fraud: refreshedFraud
    }));
    return updated;
  };

  const handleDeleteClaim = async (id) => {
    await apiRequest(`/claims/${id}`, { method: 'DELETE' }, token);
    setData((prev) => ({
      ...prev,
      claims: prev.claims.filter((claim) => claim.id !== id)
    }));
  };

  const handleCreateDocument = async (payload) => {
    const created = await apiRequest('/documents', {
      method: 'POST',
      body: JSON.stringify(payload)
    }, token);
    setData((prev) => ({ ...prev, documents: [created, ...prev.documents] }));
    return created;
  };

  const handleClassifyDocument = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/documents/classify`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Classification failed');
    }
    return data;
  };

  const handleUploadDocument = async ({ file, status }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (status) formData.append('status', status);

    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Upload failed');
    }
    setData((prev) => ({ ...prev, documents: [data, ...prev.documents] }));
    return data;
  };

  const handleDeleteDocument = async (id) => {
    await apiRequest(`/documents/${id}`, { method: 'DELETE' }, token);
    setData((prev) => ({ ...prev, documents: prev.documents.filter((doc) => doc.id !== id) }));
  };

  const handleDownloadDocument = async (doc) => {
    const res = await fetch(`${API_BASE}/documents/${doc.id}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Download failed');
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name || `${doc.id}.bin`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAssistantChat = async (message) => {
    return apiRequest('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    }, token);
  };

  const handleGeneratePolicyAi = async (payload) => {
    return apiRequest('/ai/policy-recommendation', {
      method: 'POST',
      body: JSON.stringify(payload)
    }, token);
  };

  const handleGenerateClaimAi = async (payload) => {
    return apiRequest('/ai/claim-analysis', {
      method: 'POST',
      body: JSON.stringify(payload)
    }, token);
  };

  return loggedIn ? (
    <Dashboard
      activePage={activePage}
      onNavigate={setActivePage}
      data={data}
      onCreatePolicy={handleCreatePolicy}
      onUpdatePolicy={handleUpdatePolicy}
      onDeletePolicy={handleDeletePolicy}
      onCreateClaim={handleCreateClaim}
      onUpdateClaim={handleUpdateClaim}
      onDeleteClaim={handleDeleteClaim}
      onGenerateClaimAi={handleGenerateClaimAi}
      onCreateDocument={handleCreateDocument}
      onUploadDocument={handleUploadDocument}
      onClassifyDocument={handleClassifyDocument}
      onDownloadDocument={handleDownloadDocument}
      onDeleteDocument={handleDeleteDocument}
      onAssistantChat={handleAssistantChat}
      onGeneratePolicyAi={handleGeneratePolicyAi}
    />
  ) : (
    <LoginView onLogin={handleLogin} />
  );
};

export default App;





