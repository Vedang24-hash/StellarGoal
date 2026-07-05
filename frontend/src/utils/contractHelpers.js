/**
 * Smart Contract Helper Functions
 * Handles interactions with GoalManager and RewardBadge Soroban contracts
 */

// Contract IDs from environment
const GOAL_MANAGER_CONTRACT_ID = import.meta.env.VITE_GOAL_MANAGER_CONTRACT_ID;
const REWARD_BADGE_CONTRACT_ID = import.meta.env.VITE_REWARD_BADGE_CONTRACT_ID;

// Goal categories
export const GOAL_CATEGORIES = {
  EMERGENCY: 'emergency',
  VACATION: 'vacation',
  EDUCATION: 'education',
  INVESTMENT: 'investment',
  PURCHASE: 'purchase',
  OTHER: 'other'
};

// Badge types
export const BADGE_TYPES = {
  FIRST_GOAL: 'first_goal',
  GOAL_COMPLETER: 'goal_completer',
  SAVVY_SAVER: 'savvy_saver',
  MILESTONE_100: 'milestone_100',
  MILESTONE_500: 'milestone_500',
  MILESTONE_1000: 'milestone_1000'
};

/**
 * Create a new savings goal
 * @param {string} ownerAddress - Wallet address of goal owner
 * @param {string} title - Goal title
 * @param {number} targetAmount - Target amount in XLM
 * @param {string} category - Goal category
 * @param {Function} invokeContract - Contract invocation function
 * @returns {Promise<Object>} Created goal data
 */
export const createGoal = async (ownerAddress, title, targetAmount, category, invokeContract) => {
  try {
    // Note: This is a placeholder for actual Soroban contract interaction
    // In production, you would use stellar-sdk to invoke the contract
    
    const params = {
      owner: ownerAddress,
      title,
      target_amount: targetAmount,
      category
    };

    // For now, simulate the contract call
    // In production: const result = await invokeContract(GOAL_MANAGER_CONTRACT_ID, 'create_goal', params);
    
    console.log('Creating goal with params:', params);
    
    // Simulated response
    const goalId = `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      goalId,
      goal: {
        id: goalId,
        owner: ownerAddress,
        title,
        targetAmount,
        currentAmount: 0,
        category,
        status: 'active',
        createdAt: Date.now()
      }
    };
  } catch (error) {
    console.error('Error creating goal:', error);
    throw new Error('Failed to create goal. Please try again.');
  }
};

/**
 * Deposit XLM to a goal
 * @param {string} goalId - Goal ID
 * @param {number} amount - Amount to deposit in XLM
 * @param {string} depositorAddress - Address making the deposit
 * @param {Function} invokeContract - Contract invocation function
 * @returns {Promise<Object>} Deposit result
 */
export const depositToGoal = async (goalId, amount, depositorAddress, invokeContract) => {
  try {
    const params = {
      goal_id: goalId,
      amount,
      depositor: depositorAddress
    };

    console.log('Depositing to goal:', params);
    
    // Simulated response
    return {
      success: true,
      goalId,
      depositAmount: amount,
      newBalance: 0, // Would be calculated by contract
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error depositing to goal:', error);
    throw new Error('Failed to deposit to goal. Please try again.');
  }
};

/**
 * Complete a goal and trigger badge issuance
 * @param {string} goalId - Goal ID to complete
 * @param {string} ownerAddress - Goal owner address
 * @param {Function} invokeContract - Contract invocation function
 * @returns {Promise<Object>} Completion result with badge info
 */
export const completeGoal = async (goalId, ownerAddress, invokeContract) => {
  try {
    const params = {
      goal_id: goalId,
      owner: ownerAddress
    };

    console.log('Completing goal:', params);
    
    // This would trigger inter-contract call to RewardBadgeContract
    return {
      success: true,
      goalId,
      completedAt: Date.now(),
      badgeIssued: true,
      badge: {
        id: `badge_${Date.now()}`,
        type: BADGE_TYPES.GOAL_COMPLETER,
        issuedAt: Date.now()
      }
    };
  } catch (error) {
    console.error('Error completing goal:', error);
    throw new Error('Failed to complete goal. Please try again.');
  }
};

/**
 * Get a single goal by ID
 * @param {string} goalId - Goal ID
 * @param {Function} queryContract - Contract query function
 * @returns {Promise<Object>} Goal data
 */
export const getGoal = async (goalId, queryContract) => {
  try {
    console.log('Fetching goal:', goalId);
    
    // Simulated response - in production would query contract
    return {
      id: goalId,
      owner: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      title: 'Sample Goal',
      targetAmount: 100,
      currentAmount: 50,
      category: GOAL_CATEGORIES.EMERGENCY,
      status: 'active',
      createdAt: Date.now() - 86400000
    };
  } catch (error) {
    console.error('Error fetching goal:', error);
    throw new Error('Failed to fetch goal. Please try again.');
  }
};

/**
 * Get all goals for an owner
 * @param {string} ownerAddress - Owner wallet address
 * @param {Function} queryContract - Contract query function
 * @returns {Promise<Array>} Array of goals
 */
export const getGoalsByOwner = async (ownerAddress, queryContract) => {
  try {
    console.log('Fetching goals for owner:', ownerAddress);
    
    // In production, this would query the contract
    // Returning from localStorage for demo purposes
    const storedGoals = localStorage.getItem('stellargoal_goals');
    if (storedGoals) {
      const goals = JSON.parse(storedGoals);
      return goals.filter(g => g.owner === ownerAddress);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw new Error('Failed to fetch goals. Please try again.');
  }
};

/**
 * Get deposit history for a goal
 * @param {string} goalId - Goal ID
 * @param {Function} queryContract - Contract query function
 * @returns {Promise<Array>} Array of deposits
 */
export const getDepositHistory = async (goalId, queryContract) => {
  try {
    console.log('Fetching deposit history for:', goalId);
    
    const storedDeposits = localStorage.getItem(`stellargoal_deposits_${goalId}`);
    if (storedDeposits) {
      return JSON.parse(storedDeposits);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching deposit history:', error);
    throw new Error('Failed to fetch deposit history.');
  }
};

/**
 * Get badges for a user
 * @param {string} ownerAddress - Wallet address
 * @param {Function} queryContract - Contract query function
 * @returns {Promise<Array>} Array of badges
 */
export const getUserBadges = async (ownerAddress, queryContract) => {
  try {
    console.log('Fetching badges for:', ownerAddress);
    
    const storedBadges = localStorage.getItem(`stellargoal_badges_${ownerAddress}`);
    if (storedBadges) {
      return JSON.parse(storedBadges);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching badges:', error);
    throw new Error('Failed to fetch badges.');
  }
};

/**
 * Format XLM amount for display
 * @param {string|number} amount - Amount to format
 * @returns {string} Formatted amount
 */
export const formatXLM = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7
  });
};

/**
 * Calculate goal progress percentage
 * @param {number} currentAmount - Current amount
 * @param {number} targetAmount - Target amount
 * @returns {number} Progress percentage (0-100)
 */
export const calculateProgress = (currentAmount, targetAmount) => {
  if (targetAmount === 0) return 0;
  const progress = (currentAmount / targetAmount) * 100;
  return Math.min(progress, 100);
};

/**
 * Get category display name
 * @param {string} category - Category key
 * @returns {string} Display name
 */
export const getCategoryDisplayName = (category) => {
  const names = {
    emergency: '🚨 Emergency Fund',
    vacation: '✈️ Vacation',
    education: '📚 Education',
    investment: '📈 Investment',
    purchase: '🛍️ Purchase',
    other: '📌 Other'
  };
  return names[category] || category;
};

/**
 * Get badge display info
 * @param {string} badgeType - Badge type
 * @returns {Object} Badge display data
 */
export const getBadgeDisplayInfo = (badgeType) => {
  const badges = {
    first_goal: { name: 'First Goal', emoji: '🎯', description: 'Created your first goal' },
    goal_completer: { name: 'Goal Completer', emoji: '✅', description: 'Completed a savings goal' },
    savvy_saver: { name: 'Savvy Saver', emoji: '💰', description: 'Saved 100 XLM total' },
    milestone_100: { name: '100 XLM Club', emoji: '🥉', description: 'Reached 100 XLM milestone' },
    milestone_500: { name: '500 XLM Club', emoji: '🥈', description: 'Reached 500 XLM milestone' },
    milestone_1000: { name: '1000 XLM Club', emoji: '🥇', description: 'Reached 1000 XLM milestone' }
  };
  return badges[badgeType] || { name: badgeType, emoji: '🏆', description: 'Achievement unlocked' };
};

export default {
  GOAL_CATEGORIES,
  BADGE_TYPES,
  createGoal,
  depositToGoal,
  completeGoal,
  getGoal,
  getGoalsByOwner,
  getDepositHistory,
  getUserBadges,
  calculateProgress,
  getCategoryDisplayName,
  getBadgeDisplayInfo
};
