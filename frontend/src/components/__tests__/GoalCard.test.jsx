import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GoalCard from '../GoalCard';

describe('GoalCard', () => {
  const mockGoal = {
    id: 'goal_123',
    owner: 'GTEST',
    title: 'Emergency Fund',
    targetAmount: 1000,
    currentAmount: 500,
    category: 'emergency',
    status: 'active',
    createdAt: Date.now(),
    deposits: []
  };

  it('renders goal information', () => {
    render(<GoalCard goal={mockGoal} onGoalUpdated={vi.fn()} onGoalCompleted={vi.fn()} />);
    
    expect(screen.getByText(/Emergency Fund/i)).toBeTruthy();
    expect(screen.getByText(/500/)).toBeTruthy();
    expect(screen.getByText(/1000/)).toBeTruthy();
  });

  it('shows deposit button for active goals', () => {
    render(<GoalCard goal={mockGoal} onGoalUpdated={vi.fn()} onGoalCompleted={vi.fn()} />);
    
    expect(screen.getByText(/Deposit/i)).toBeTruthy();
  });

  it('shows complete button when target reached', () => {
    const completedGoal = { ...mockGoal, currentAmount: 1000 };
    render(<GoalCard goal={completedGoal} onGoalUpdated={vi.fn()} onGoalCompleted={vi.fn()} />);
    
    expect(screen.getByText(/Complete Goal/i)).toBeTruthy();
  });

  it('displays completed badge for completed goals', () => {
    const completedGoal = { ...mockGoal, status: 'completed' };
    render(<GoalCard goal={completedGoal} onGoalUpdated={vi.fn()} onGoalCompleted={vi.fn()} />);
    
    expect(screen.getByText(/Completed/i)).toBeTruthy();
  });

  it('shows deposit form when deposit button clicked', () => {
    render(<GoalCard goal={mockGoal} onGoalUpdated={vi.fn()} onGoalCompleted={vi.fn()} />);
    
    const depositButton = screen.getByText(/💰 Deposit/i);
    fireEvent.click(depositButton);
    
    expect(screen.getByPlaceholderText(/Amount/i)).toBeTruthy();
  });
});
