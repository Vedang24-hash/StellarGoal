import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateGoalForm from '../CreateGoalForm';

describe('CreateGoalForm', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders create goal button initially', () => {
    render(<CreateGoalForm ownerAddress="GTEST" onGoalCreated={vi.fn()} />);
    expect(screen.getByText(/Create New Goal/i)).toBeTruthy();
  });

  it('shows form when create button clicked', () => {
    render(<CreateGoalForm ownerAddress="GTEST" onGoalCreated={vi.fn()} />);
    
    const createButton = screen.getByText(/Create New Goal/i);
    fireEvent.click(createButton);
    
    expect(screen.getByText(/Create Savings Goal/i)).toBeTruthy();
    expect(screen.getByLabelText(/Goal Title/i)).toBeTruthy();
    expect(screen.getByLabelText(/Target Amount/i)).toBeTruthy();
  });

  it('validates empty title', async () => {
    render(<CreateGoalForm ownerAddress="GTEST" onGoalCreated={vi.fn()} />);
    
    fireEvent.click(screen.getByText(/Create New Goal/i));
    
    const submitButton = screen.getByRole('button', { name: /Create Goal/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Please enter a goal title/i)).toBeTruthy();
    });
  });

  it('creates goal successfully', async () => {
    const onGoalCreated = vi.fn();
    render(<CreateGoalForm ownerAddress="GTEST" onGoalCreated={onGoalCreated} />);
    
    fireEvent.click(screen.getByText(/Create New Goal/i));
    
    const titleInput = screen.getByLabelText(/Goal Title/i);
    const amountInput = screen.getByLabelText(/Target Amount/i);
    
    fireEvent.change(titleInput, { target: { value: 'Test Goal' } });
    fireEvent.change(amountInput, { target: { value: '100' } });
    
    const submitButton = screen.getByRole('button', { name: /Create Goal/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(onGoalCreated).toHaveBeenCalled();
    });
  });
});
