import React from 'react';

/**
 * Hero Section Component
 * Displays the main landing section with app title and description
 */
const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-icon">⭐</span>
          StellarGoal
        </h1>
        <p className="hero-subtitle">
          Decentralized Savings Goal Tracker on Stellar Network
        </p>
        <p className="hero-description">
          Set your financial goals, track your progress, and earn achievement badges 
          as you save XLM on the blockchain. Your savings, your control, secured by Stellar.
        </p>
        <div className="hero-features">
          <div className="hero-feature">
            <span className="feature-icon">🎯</span>
            <span>Multiple Goals</span>
          </div>
          <div className="hero-feature">
            <span className="feature-icon">📊</span>
            <span>Track Progress</span>
          </div>
          <div className="hero-feature">
            <span className="feature-icon">🏆</span>
            <span>Earn Badges</span>
          </div>
          <div className="hero-feature">
            <span className="feature-icon">🔒</span>
            <span>Blockchain Secured</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
