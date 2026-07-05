import React, { useState, useEffect } from 'react';
import { formatXLM } from '../utils/stellar';

/**
 * Analytics Dashboard Component
 * Displays savings statistics and metrics
 */
const AnalyticsDashboard = ({ ownerAddress }) => {
  const [metrics, setMetrics] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    totalXLMSaved: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateMetrics = () => {
      try {
        const goals = JSON.parse(localStorage.getItem('stellargoal_goals') || '[]');
        const userGoals = goals.filter(g => g.owner === ownerAddress);

        const totalGoals = userGoals.length;
        const activeGoals = userGoals.filter(g => g.status === 'active').length;
        const completedGoals = userGoals.filter(g => g.status === 'completed').length;
        const totalXLMSaved = userGoals.reduce((sum, g) => sum + g.currentAmount, 0);

        setMetrics({
          totalGoals,
          activeGoals,
          completedGoals,
          totalXLMSaved
        });
      } catch (err) {
        console.error('Error calculating metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (ownerAddress) {
      calculateMetrics();
      // Refresh metrics every 5 seconds
      const interval = setInterval(calculateMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [ownerAddress]);

  if (loading) {
    return (
      <div className="analytics-dashboard">
        <div className="section-header">
          <h3>📊 Analytics</h3>
        </div>
        <div className="loading-spinner-small"></div>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="section-header">
        <h3>📊 Analytics Dashboard</h3>
      </div>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.totalGoals}</div>
            <div className="metric-label">Total Goals</div>
          </div>
        </div>

        <div className="metric-card metric-active">
          <div className="metric-icon">🔥</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.activeGoals}</div>
            <div className="metric-label">Active Goals</div>
          </div>
        </div>

        <div className="metric-card metric-completed">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <div className="metric-value">{metrics.completedGoals}</div>
            <div className="metric-label">Completed Goals</div>
          </div>
        </div>

        <div className="metric-card metric-savings">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <div className="metric-value">{formatXLM(metrics.totalXLMSaved)}</div>
            <div className="metric-label">Total XLM Saved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
