import React, { useState } from 'react';

/**
 * Deposit Form Component
 * Allows depositing XLM to a specific goal
 */
const DepositForm = ({ goal, onDepositSuccess, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [depositing, setDepositing] = useState(false);
  const [error, setError] = useState(null);

  // Handle deposit submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const depositAmount = parseFloat(amount);
    const remainingAmount = goal.targetAmount - goal.currentAmount;

    if (depositAmount > remainingAmount + 0.0000001) {
      setError(`Amount exceeds remaining target (${remainingAmount.toFixed(7)} XLM)`);
      return;
    }

    setDepositing(true);

    try {
      // Update goal in localStorage
      const goals = JSON.parse(localStorage.getItem('stellargoal_goals') || '[]');
      const goalIndex = goals.findIndex(g => g.id === goal.id);
      
      if (goalIndex !== -1) {
        goals[goalIndex].currentAmount += depositAmount;
        
        // Add deposit to history
        const deposit = {
          id: `deposit_${Date.now()}`,
          amount: depositAmount,
          timestamp: Date.now(),
          depositor: goal.owner
        };
        
        if (!goals[goalIndex].deposits) {
          goals[goalIndex].deposits = [];
        }
        goals[goalIndex].deposits.push(deposit);
        
        localStorage.setItem('stellargoal_goals', JSON.stringify(goals));
        
        // Store deposit history separately for query
        const depositHistory = JSON.parse(
          localStorage.getItem(`stellargoal_deposits_${goal.id}`) || '[]'
        );
        depositHistory.push(deposit);
        localStorage.setItem(`stellargoal_deposits_${goal.id}`, JSON.stringify(depositHistory));

        // Check for milestone badges
        const totalSaved = goals
          .filter(g => g.owner === goal.owner)
          .reduce((sum, g) => sum + g.currentAmount, 0);
        
        const badges = JSON.parse(localStorage.getItem(`stellargoal_badges_${goal.owner}`) || '[]');
        
        if (totalSaved >= 100 && !badges.find(b => b.type === 'milestone_100')) {
          badges.push({ id: `badge_${Date.now()}`, type: 'milestone_100', issuedAt: Date.now() });
        }
        if (totalSaved >= 500 && !badges.find(b => b.type === 'milestone_500')) {
          badges.push({ id: `badge_${Date.now()}`, type: 'milestone_500', issuedAt: Date.now() });
        }
        if (totalSaved >= 1000 && !badges.find(b => b.type === 'milestone_1000')) {
          badges.push({ id: `badge_${Date.now()}`, type: 'milestone_1000', issuedAt: Date.now() });
        }
        
        localStorage.setItem(`stellargoal_badges_${goal.owner}`, JSON.stringify(badges));

        // Notify parent
        if (onDepositSuccess) {
          onDepositSuccess(goals[goalIndex]);
        }

        setAmount('');
      }
    } catch (err) {
      setError(err.message || 'Failed to deposit');
    } finally {
      setDepositing(false);
    }
  };

  return (
    <div className="deposit-form">
      <form onSubmit={handleSubmit} className="form-inline">
        {error && (
          <div className="alert alert-error alert-small">
            <p>{error}</p>
          </div>
        )}

        <div className="form-group-inline">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (XLM)"
            step="0.0000001"
            min="0.0000001"
            className="form-input form-input-small"
            disabled={depositing}
            required
          />
          <button 
            type="submit" 
            disabled={depositing}
            className="button button-primary button-small"
          >
            {depositing ? 'Depositing...' : 'Deposit'}
          </button>
          {onCancel && (
            <button 
              type="button"
              onClick={onCancel}
              disabled={depositing}
              className="button button-secondary button-small"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default DepositForm;
