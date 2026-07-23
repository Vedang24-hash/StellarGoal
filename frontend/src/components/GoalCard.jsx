import React, { useState } from 'react';
import { calculateProgress, getCategoryDisplayName, formatXLM } from '../utils/contractHelpers';
import { getTransactionUrl, shortenAddress } from '../utils/stellar';
import DepositForm from './DepositForm';
import DepositHistory from './DepositHistory';

/**
 * Goal Card Component
 * Displays individual goal with progress and actions
 */
const GoalCard = ({ goal, onGoalUpdated, onGoalCompleted }) => {
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [completing, setCompleting] = useState(false);

  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
  const isComplete = goal.currentAmount >= goal.targetAmount;

  // Handle deposit success
  const handleDepositSuccess = (depositData) => {
    setShowDepositForm(false);
    if (onGoalUpdated) {
      onGoalUpdated(depositData);
    }
  };

  // Handle goal completion
  const handleCompleteGoal = async () => {
    if (!isComplete) return;

    setCompleting(true);
    try {
      // Update goal status
      const goals = JSON.parse(localStorage.getItem('stellargoal_goals') || '[]');
      const goalIndex = goals.findIndex(g => g.id === goal.id);
      if (goalIndex !== -1) {
        goals[goalIndex].status = 'completed';
        goals[goalIndex].completedAt = Date.now();
        localStorage.setItem('stellargoal_goals', JSON.stringify(goals));

        // Issue badge
        const badges = JSON.parse(localStorage.getItem(`stellargoal_badges_${goal.owner}`) || '[]');
        badges.push({
          id: `badge_${Date.now()}`,
          type: 'goal_completer',
          issuedAt: Date.now(),
          goalId: goal.id
        });
        localStorage.setItem(`stellargoal_badges_${goal.owner}`, JSON.stringify(badges));

        if (onGoalCompleted) {
          onGoalCompleted(goals[goalIndex]);
        }
      }
    } catch (err) {
      console.error('Error completing goal:', err);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className={`goal-card ${goal.status === 'completed' ? 'goal-completed' : ''}`}>
      <div className="goal-card-header">
        <div className="goal-title-section">
          <h4 className="goal-title">{goal.title}</h4>
          <span className="goal-category">{getCategoryDisplayName(goal.category)}</span>
        </div>
        {goal.status === 'completed' && (
          <span className="goal-status-badge">✅ Completed</span>
        )}
      </div>

      <div className="goal-card-body">
        <div className="goal-amounts">
          <div className="goal-amount">
            <span className="amount-label">Current</span>
            <span className="amount-value">{formatXLM(goal.currentAmount)} XLM</span>
          </div>
          <div className="goal-amount">
            <span className="amount-label">Target</span>
            <span className="amount-value">{formatXLM(goal.targetAmount)} XLM</span>
          </div>
        </div>

        <div className="goal-progress">
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{progress.toFixed(1)}%</span>
        </div>

        {showDepositForm && goal.status === 'active' && (
          <DepositForm
            goal={goal}
            onDepositSuccess={handleDepositSuccess}
            onCancel={() => setShowDepositForm(false)}
          />
        )}

        {showHistory && (
          <DepositHistory
            goalId={goal.id}
            onClose={() => setShowHistory(false)}
          />
        )}

        {/* Recent Transactions Section - Always Visible for Accountability */}
        {goal.deposits && goal.deposits.length > 0 && (
          <div className="goal-transactions">
            <div className="transactions-header">
              <h5>🔗 Recent Transactions</h5>
              <small>{goal.deposits.length} total</small>
            </div>
            <div className="transactions-list">
              {goal.deposits.slice(-3).reverse().map((deposit) => (
                <div key={deposit.id} className="transaction-item">
                  <div className="transaction-info">
                    <span className="transaction-amount">
                      +{formatXLM(deposit.amount)} XLM
                    </span>
                    <span className="transaction-date">
                      {new Date(deposit.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  {deposit.txHash ? (
                    <a
                      href={getTransactionUrl(deposit.txHash, 'TESTNET')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transaction-hash-link"
                      title={`View transaction ${deposit.txHash} on Stellar Expert`}
                    >
                      <span className="hash-icon">🔗</span>
                      <span className="hash-text">{shortenAddress(deposit.txHash, 8)}</span>
                    </a>
                  ) : (
                    <span className="transaction-no-hash">No tx hash</span>
                  )}
                </div>
              ))}
            </div>
            {goal.deposits.length > 3 && (
              <button
                onClick={() => setShowHistory(true)}
                className="button-link"
              >
                View all {goal.deposits.length} transactions →
              </button>
            )}
          </div>
        )}

        <div className="goal-actions">
          {goal.status === 'active' && (
            <>
              {!showDepositForm && (
                <button
                  onClick={() => setShowDepositForm(true)}
                  className="button button-primary button-small"
                >
                  💰 Deposit
                </button>
              )}
              {isComplete && (
                <button
                  onClick={handleCompleteGoal}
                  disabled={completing}
                  className="button button-success button-small"
                >
                  {completing ? 'Completing...' : '✓ Complete Goal'}
                </button>
              )}
            </>
          )}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="button button-secondary button-small"
          >
            📜 History ({goal.deposits?.length || 0})
          </button>
        </div>

        <div className="goal-meta">
          <small>Created {new Date(goal.createdAt).toLocaleDateString()}</small>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
