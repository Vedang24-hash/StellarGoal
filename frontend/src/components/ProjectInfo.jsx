import React from 'react';

/**
 * Project Info Component
 * Displays informative content about StellarGoal
 */
const ProjectInfo = () => {
  return (
    <div className="project-info-card">
      <div className="project-info-header">
        <h3>💡 About StellarGoal</h3>
      </div>
      <div className="project-info-body">
        <p className="project-description">
          <strong>StellarGoal</strong> is a decentralized savings goal tracker built on the Stellar blockchain. 
          Take control of your financial future with transparent, secure, and blockchain-verified savings goals.
        </p>

        <div className="project-features-grid">
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <div className="feature-content">
              <h4>Set Multiple Goals</h4>
              <p>Create unlimited savings goals for emergencies, vacations, education, and more.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <div className="feature-content">
              <h4>Track Progress</h4>
              <p>Monitor your savings in real-time with visual progress bars and analytics.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🏆</div>
            <div className="feature-content">
              <h4>Earn Badges</h4>
              <p>Unlock achievement badges as you reach milestones and complete goals.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🔒</div>
            <div className="feature-content">
              <h4>Blockchain Security</h4>
              <p>All transactions are secured by Stellar's fast and reliable network.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">💰</div>
            <div className="feature-content">
              <h4>XLM Deposits</h4>
              <p>Save using Stellar Lumens (XLM) with low transaction fees.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">📈</div>
            <div className="feature-content">
              <h4>Analytics Dashboard</h4>
              <p>View comprehensive statistics about your savings journey.</p>
            </div>
          </div>
        </div>

        <div className="project-stats">
          <div className="stat-item">
            <div className="stat-value">⚡</div>
            <div className="stat-label">Fast Transactions</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">🌐</div>
            <div className="stat-label">Decentralized</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">🔐</div>
            <div className="stat-label">Secure & Private</div>
          </div>
        </div>

        <div className="project-cta">
          <p className="cta-text">
            <strong>Ready to start saving?</strong> Connect your Freighter wallet using the button in the navigation bar above to begin your journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
