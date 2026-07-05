import React, { useState, useEffect } from 'react';
import GoalCard from './GoalCard';

/**
 * Goals List Component
 * Displays all goals for the user
 */
const GoalsList = ({ ownerAddress, refreshTrigger }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Load goals
  const loadGoals = () => {
    try {
      const allGoals = JSON.parse(localStorage.getItem('stellargoal_goals') || '[]');
      const userGoals = allGoals.filter(g => g.owner === ownerAddress);
      setGoals(userGoals);
    } catch (err) {
      console.error('Error loading goals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerAddress) {
      loadGoals();
    }
  }, [ownerAddress, refreshTrigger]);

  // Handle goal update
  const handleGoalUpdated = (updatedGoal) => {
    loadGoals(); // Reload all goals
  };

  // Handle goal completion
  const handleGoalCompleted = (completedGoal) => {
    loadGoals(); // Reload all goals
  };

  // Filter goals
  const filteredGoals = goals.filter(goal => {
    if (filter === 'active') return goal.status === 'active';
    if (filter === 'completed') return goal.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <div className="goals-list">
        <div className="loading-spinner"></div>
        <p>Loading goals...</p>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="goals-list">
        <div className="section-header">
          <h3>🎯 Your Goals</h3>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">🎯</div>
          <h3>No Goals Yet</h3>
          <p>Create your first savings goal to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="goals-list">
      <div className="section-header">
        <h3>🎯 Your Goals</h3>
        <div className="filter-buttons">
          <button
            onClick={() => setFilter('all')}
            className={`button button-small ${filter === 'all' ? 'button-primary' : 'button-secondary'}`}
          >
            All ({goals.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`button button-small ${filter === 'active' ? 'button-primary' : 'button-secondary'}`}
          >
            Active ({goals.filter(g => g.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`button button-small ${filter === 'completed' ? 'button-primary' : 'button-secondary'}`}
          >
            Completed ({goals.filter(g => g.status === 'completed').length})
          </button>
        </div>
      </div>

      <div className="goals-grid">
        {filteredGoals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onGoalUpdated={handleGoalUpdated}
            onGoalCompleted={handleGoalCompleted}
          />
        ))}
      </div>

      {filteredGoals.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No {filter} goals found</h3>
          <p>Try changing the filter to see your other goals</p>
        </div>
      )}
    </div>
  );
};

export default GoalsList;
