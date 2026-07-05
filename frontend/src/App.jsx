import { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProjectInfo from './components/ProjectInfo';
import BalanceCard from './components/BalanceCard';
import SendXLMForm from './components/SendXLMForm';
import CreateGoalForm from './components/CreateGoalForm';
import GoalsList from './components/GoalsList';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import BadgeSection from './components/BadgeSection';
import './App.css';

/**
 * Main App Component
 * StellarGoal - Decentralized Savings Goal Tracker
 */
function App() {
  const wallet = useWallet();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showSendForm, setShowSendForm] = useState(false);

  // Trigger refresh of goals list
  const handleGoalCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle transaction completion (refresh balance)
  const handleTransactionComplete = (result) => {
    console.log('Transaction completed:', result);
    // Balance card will auto-refresh, but we can trigger additional updates here
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      {/* Navigation Bar */}
      <Navbar 
        wallet={wallet} 
        onSendClick={wallet.address ? () => setShowSendForm(true) : null}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="container">
        {/* Project Information Section - Always Visible */}
        <section className="section">
          <ProjectInfo />
        </section>

        {/* Send XLM Modal */}
        {showSendForm && wallet.address && (
          <div className="modal-overlay" onClick={() => setShowSendForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <SendXLMForm
                sourceAddress={wallet.address}
                network={wallet.network}
                onTransactionComplete={(result) => {
                  handleTransactionComplete(result);
                  setShowSendForm(false);
                }}
              />
              <button
                onClick={() => setShowSendForm(false)}
                className="button button-secondary button-large"
                style={{ marginTop: '10px', width: '100%' }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Connected State - Show Dashboard */}
        {wallet.address && wallet.networkOk && (
          <>
            {/* Balance */}
            <section className="section">
              <BalanceCard address={wallet.address} />
            </section>

            {/* Analytics Dashboard */}
            <section className="section">
              <AnalyticsDashboard ownerAddress={wallet.address} />
            </section>

            {/* Create Goal Form */}
            <section className="section">
              <CreateGoalForm
                ownerAddress={wallet.address}
                onGoalCreated={handleGoalCreated}
              />
            </section>

            {/* Goals List */}
            <section className="section">
              <GoalsList
                ownerAddress={wallet.address}
                refreshTrigger={refreshTrigger}
              />
            </section>

            {/* Badges Section */}
            <section className="section">
              <BadgeSection ownerAddress={wallet.address} />
            </section>
          </>
        )}

        {/* Network Error State */}
        {wallet.address && !wallet.networkOk && (
          <section className="section">
            <div className="alert alert-error">
              <h3>⚠️ Network Mismatch</h3>
              <p>Please switch to Stellar Testnet in your Freighter wallet.</p>
              <p>Current network: {wallet.network || 'Unknown'}</p>
            </div>
          </section>
        )}

        {/* Not Connected State */}
        {!wallet.address && wallet.installed !== null && (
          <section className="section">
            <div className="info-section">
              <h2>How It Works</h2>
              <div className="steps-grid">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h4>Connect Wallet</h4>
                  <p>Connect your Freighter wallet or try demo mode</p>
                </div>
                <div className="step-card">
                  <div className="step-number">2</div>
                  <h4>Create Goals</h4>
                  <p>Set up your savings goals with target amounts</p>
                </div>
                <div className="step-card">
                  <div className="step-number">3</div>
                  <h4>Save & Track</h4>
                  <p>Deposit XLM and track your progress in real-time</p>
                </div>
                <div className="step-card">
                  <div className="step-number">4</div>
                  <h4>Earn Badges</h4>
                  <p>Complete goals and unlock achievement badges</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>Built on Stellar Testnet with Soroban Smart Contracts</p>
          <p>
            <a href="https://stellar.org" target="_blank" rel="noopener noreferrer">
              Stellar.org
            </a>
            {' | '}
            <a href="https://www.freighter.app/" target="_blank" rel="noopener noreferrer">
              Freighter Wallet
            </a>
            {' | '}
            <a href="https://soroban.stellar.org" target="_blank" rel="noopener noreferrer">
              Soroban Docs
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
