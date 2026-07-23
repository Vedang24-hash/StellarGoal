import React, { useState } from 'react';
import { sendXLM } from '../utils/stellar';
import freighter from '@stellar/freighter-api';

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
      // Check if Freighter is available and connected
      const isConnected = await freighter.isConnected();
      if (!isConnected) {
        throw new Error('Freighter wallet not found. Please install Freighter extension.');
      }

      // Check if we have permission
      const isAllowed = await freighter.isAllowed();
      if (!isAllowed) {
        throw new Error('Please connect your Freighter wallet first.');
      }

      // Get user's public key
      let publicKey;
      try {
        publicKey = await freighter.getPublicKey();
      } catch (keyError) {
        console.error('Error getting public key:', keyError);
        throw new Error('Please unlock your Freighter wallet and try again.');
      }
      
      // Get goal escrow address (in production, this would be the contract's escrow account)
      // For demo purposes, we'll use a designated escrow address from env or generate one
      const escrowAddress = import.meta.env.VITE_ESCROW_ADDRESS || goal.escrowAddress || goal.owner;
      
      // If sending to self (demo mode), show warning
      if (escrowAddress === publicKey) {
        console.warn('Demo mode: Sending to self. In production, this would go to contract escrow.');
      }

      // Send XLM transaction through Freighter
      const result = await sendXLM(
        publicKey,
        escrowAddress,
        depositAmount.toString(),
        freighter.signTransaction
      );

      if (!result.success) {
        throw new Error('Transaction failed. Please try again.');
      }

      console.log('Deposit transaction successful:', result.hash);

      // Update goal in localStorage after successful blockchain transaction
      const goals = JSON.parse(localStorage.getItem('stellargoal_goals') || '[]');
      const goalIndex = goals.findIndex(g => g.id === goal.id);
      
      if (goalIndex !== -1) {
        goals[goalIndex].currentAmount += depositAmount;
        
        // Add deposit to history with transaction hash
        const deposit = {
          id: `deposit_${Date.now()}`,
          amount: depositAmount,
          timestamp: Date.now(),
          depositor: publicKey,
          txHash: result.hash,
          ledger: result.ledger
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
      } else {
        throw new Error('Goal not found');
      }
    } catch (err) {
      console.error('Deposit error:', err);
      
      // User-friendly error messages
      if (err.message.includes('User declined')) {
        setError('Transaction cancelled by user');
      } else if (err.message.includes('Insufficient balance')) {
        setError('Insufficient XLM balance (remember to keep 1 XLM minimum reserve)');
      } else if (err.message.includes('Freighter')) {
        setError('Please install and unlock Freighter wallet extension');
      } else {
        setError(err.message || 'Failed to deposit. Please try again.');
      }
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
