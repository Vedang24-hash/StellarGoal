import React, { useState } from 'react';
import { GOAL_CATEGORIES, getCategoryDisplayName } from '../utils/contractHelpers';

/**
 * Create Goal Form Component
 * Allows users to create new savings goals
 */
const CreateGoalForm = ({ ownerAddress, onGoalCreated }) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState(GOAL_CATEGORIES.EMERGENCY);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError('Please enter a goal title');
      return;
    }

    if (title.length > 50) {
      setError('Title must be 50 characters or less');
      return;
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      setError('Please enter a valid target amount');
      return;
    }

    if (parseFloat(targetAmount) > 1000000) {
      setError('Target amount is too large');
      return;
    }

    setCreating(true);

    try {
      // Create goal object
      const newGoal = {
        id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        owner: ownerAddress,
        title: title.trim(),
        targetAmount: parseFloat(targetAmount),
        currentAmount: 0,
        category,
        status: 'active',
        createdAt: Date.now(),
        deposits: []
      };

      // Store in localStorage (simulating contract storage)
      const existingGoals = JSON.parse(localStorage.getItem('stellargoal_goals') || '[]');
      existingGoals.push(newGoal);
      localStorage.setItem('stellargoal_goals', JSON.stringify(existingGoals));

      // Check if this is the first goal and issue badge
      if (existingGoals.filter(g => g.owner === ownerAddress).length === 1) {
        const badges = JSON.parse(localStorage.getItem(`stellargoal_badges_${ownerAddress}`) || '[]');
        badges.push({
          id: `badge_${Date.now()}`,
          type: 'first_goal',
          issuedAt: Date.now()
        });
        localStorage.setItem(`stellargoal_badges_${ownerAddress}`, JSON.stringify(badges));
      }

      // Reset form
      setTitle('');
      setTargetAmount('');
      setCategory(GOAL_CATEGORIES.EMERGENCY);
      setShowForm(false);

      // Notify parent
      if (onGoalCreated) {
        onGoalCreated(newGoal);
      }
    } catch (err) {
      setError(err.message || 'Failed to create goal');
    } finally {
      setCreating(false);
    }
  };

  if (!showForm) {
    return (
      <div className="create-goal-prompt">
        <button 
          onClick={() => setShowForm(true)}
          className="button button-primary button-large"
        >
          <span className="button-icon">➕</span>
          Create New Goal
        </button>
      </div>
    );
  }

  return (
    <div className="create-goal-form">
      <div className="form-header">
        <h3>🎯 Create Savings Goal</h3>
        <button 
          onClick={() => setShowForm(false)}
          className="button button-icon-only"
          title="Cancel"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form">
        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="goal-title" className="form-label">
            Goal Title *
          </label>
          <input
            type="text"
            id="goal-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Emergency Fund, Vacation, New Car"
            className="form-input"
            disabled={creating}
            maxLength="50"
            required
          />
          <small className="form-help">Maximum 50 characters</small>
        </div>

        <div className="form-group">
          <label htmlFor="target-amount" className="form-label">
            Target Amount (XLM) *
          </label>
          <input
            type="number"
            id="target-amount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="0.00"
            step="0.0000001"
            min="0.0000001"
            className="form-input"
            disabled={creating}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
            disabled={creating}
            required
          >
            {Object.values(GOAL_CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {getCategoryDisplayName(cat)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="button"
            onClick={() => setShowForm(false)}
            disabled={creating}
            className="button button-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={creating}
            className="button button-primary"
          >
            {creating ? (
              <>
                <span className="loading-spinner-small"></span>
                Creating...
              </>
            ) : (
              'Create Goal'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGoalForm;
