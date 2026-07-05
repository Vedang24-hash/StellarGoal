import React, { useState, useEffect } from 'react';
import { getBadgeDisplayInfo } from '../utils/contractHelpers';

/**
 * Badge Section Component
 * Displays earned achievement badges
 */
const BadgeSection = ({ ownerAddress }) => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = () => {
      try {
        const userBadges = JSON.parse(
          localStorage.getItem(`stellargoal_badges_${ownerAddress}`) || '[]'
        );
        setBadges(userBadges);
      } catch (err) {
        console.error('Error loading badges:', err);
      } finally {
        setLoading(false);
      }
    };

    if (ownerAddress) {
      loadBadges();
    }
  }, [ownerAddress]);

  if (loading) {
    return (
      <div className="badge-section">
        <div className="section-header">
          <h3>🏆 Achievement Badges</h3>
        </div>
        <div className="loading-spinner-small"></div>
      </div>
    );
  }

  if (badges.length === 0) {
    return (
      <div className="badge-section">
        <div className="section-header">
          <h3>🏆 Achievement Badges</h3>
        </div>
        <div className="empty-state">
          <p>💡 Complete goals and reach milestones to earn badges!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="badge-section">
      <div className="section-header">
        <h3>🏆 Achievement Badges</h3>
        <span className="badge-count">{badges.length} earned</span>
      </div>
      <div className="badge-grid">
        {badges.map((badge) => {
          const badgeInfo = getBadgeDisplayInfo(badge.type);
          return (
            <div key={badge.id} className="badge-card">
              <div className="badge-icon">{badgeInfo.emoji}</div>
              <div className="badge-info">
                <div className="badge-name">{badgeInfo.name}</div>
                <div className="badge-description">{badgeInfo.description}</div>
                <div className="badge-date">
                  <small>Earned {new Date(badge.issuedAt).toLocaleDateString()}</small>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgeSection;
