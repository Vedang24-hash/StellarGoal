# ⭐ StellarGoal - Decentralized Savings Goal Tracker

![StellarGoal Banner](./docs/screenshot-placeholder-hero.png)

**StellarGoal** is a production-ready decentralized application (dApp) built on the **Stellar Testnet** that allows users to create, track, and complete savings goals using **XLM** (Stellar Lumens). Users earn achievement badges through Soroban smart contracts as they reach milestones.

[![CI/CD Pipeline](https://github.com/yourusername/stellargoal/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/yourusername/stellargoal/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Project Overview

StellarGoal demonstrates a complete implementation of:
- ✅ Multi-wallet connection (Freighter + Demo mode)
- ✅ Real-time XLM balance tracking
- ✅ Multiple savings goals with progress tracking
- ✅ XLM deposits to goals
- ✅ Goal completion with automated badge rewards
- ✅ Achievement badge system via inter-contract communication
- ✅ Analytics dashboard with savings metrics
- ✅ Mobile-responsive UI with production-ready UX

---

## 🚀 Features

### Wallet Management
- **Freighter Wallet Integration** with auto-detection and session restore
- **Demo Mode** for testing without wallet installation
- **Network Validation** (Testnet/Mainnet)
- **Auto-refresh Balance** (every 15 seconds)

### Savings Goals
- **Create Multiple Goals** with custom titles, targets, and categories
- **Six Goal Categories**: Emergency Fund, Vacation, Education, Investment, Purchase, Other
- **Real-time Progress Tracking** with visual progress bars
- **Deposit XLM** to goals with transaction validation
- **Goal Completion** with automated badge issuance
- **Deposit History** for each goal

### Achievement Badges
- 🎯 **First Goal** - Created your first savings goal
- ✅ **Goal Completer** - Completed a savings goal
- 💰 **Savvy Saver** - Saved 100 XLM total
- 🥉 **100 XLM Club** - Reached 100 XLM milestone
- 🥈 **500 XLM Club** - Reached 500 XLM milestone
- 🥇 **1000 XLM Club** - Reached 1000 XLM milestone

### Analytics Dashboard
- **Total Goals** count
- **Active Goals** tracker
- **Completed Goals** summary
- **Total XLM Saved** across all goals

### Transaction Features
- **Send XLM** to any Stellar address
- **Transaction Status** tracking (pending/success/failure)
- **Transaction Hash** with link to Stellar Expert
- **Error Handling** for insufficient balance, invalid addresses, network failures

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Plain CSS** - No UI libraries (single `App.css` file)
- **Freighter API** (`@stellar/freighter-api`) for wallet connection
- **Stellar SDK** (`@stellar/stellar-sdk`) for blockchain interactions

### Smart Contracts
- **Rust** with **Soroban SDK 21.0.0**
- **Two Smart Contracts**:
  1. **GoalManagerContract** - Manages savings goals and deposits
  2. **RewardBadgeContract** - Issues achievement badges
- **Inter-contract Communication** - GoalManager calls RewardBadge on completion

### Testing
- **Vitest** for React component tests
- **React Testing Library** for component testing
- **Rust built-in tests** for contract logic

### CI/CD
- **GitHub Actions** workflow
- Automated frontend and contract testing
- Build artifact generation

---

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Rust** 1.70+ with `wasm32-unknown-unknown` target
- **Soroban CLI** for contract deployment
- **Freighter Wallet** browser extension (optional, demo mode available)
- **Stellar Testnet** account with XLM balance

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/stellargoal.git
cd stellargoal
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

### 3. Environment Variables

Copy `.env.example` to `.env` and configure:

```env
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_GOAL_MANAGER_CONTRACT_ID=YOUR_GOAL_MANAGER_CONTRACT_ID_HERE
VITE_REWARD_BADGE_CONTRACT_ID=YOUR_REWARD_BADGE_CONTRACT_ID_HERE
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

### 4. Install Rust & Soroban CLI

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm target
rustup target add wasm32-unknown-unknown

# Install Soroban CLI
cargo install --locked soroban-cli --features opt
```

---

## 📦 Smart Contract Deployment

### 1. Build Contracts

```bash
# Build GoalManager Contract
cd contracts/goal_manager_contract
cargo build --target wasm32-unknown-unknown --release

# Build RewardBadge Contract
cd ../reward_badge_contract
cargo build --target wasm32-unknown-unknown --release
```

### 2. Deploy to Stellar Testnet

```bash
# Configure Soroban for testnet
soroban config network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate deployment identity
soroban keys generate deployer --network testnet

# Fund the deployer account (get testnet XLM)
# Visit: https://laboratory.stellar.org/#account-creator?network=test

# Deploy RewardBadge Contract first
cd contracts/reward_badge_contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/reward_badge_contract.wasm \
  --source deployer \
  --network testnet

# Save the returned contract ID as REWARD_BADGE_CONTRACT_ID

# Deploy GoalManager Contract
cd ../goal_manager_contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/goal_manager_contract.wasm \
  --source deployer \
  --network testnet

# Save the returned contract ID as GOAL_MANAGER_CONTRACT_ID

# Initialize GoalManager with RewardBadge address
soroban contract invoke \
  --id <GOAL_MANAGER_CONTRACT_ID> \
  --source deployer \
  --network testnet \
  -- initialize \
  --reward_contract <REWARD_BADGE_CONTRACT_ID>
```

### 3. Update Frontend Environment

Update `frontend/.env` with your deployed contract IDs:

```env
VITE_GOAL_MANAGER_CONTRACT_ID=<YOUR_GOAL_MANAGER_CONTRACT_ID>
VITE_REWARD_BADGE_CONTRACT_ID=<YOUR_REWARD_BADGE_CONTRACT_ID>
```

---

## 🚀 Running the Application

### Development Mode

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
cd frontend
npm run build
npm run preview
```

---

## 🧪 Testing

### Run Frontend Tests

```bash
cd frontend
npm test
```

### Run Contract Tests

```bash
# Test GoalManager Contract
cd contracts/goal_manager_contract
cargo test

# Test RewardBadge Contract
cd ../reward_badge_contract
cargo test
```

### Test Coverage

- ✅ Wallet connection component
- ✅ Goal creation form validation
- ✅ Goal card rendering
- ✅ Create goal contract function
- ✅ Deposit to goal contract function
- ✅ Complete goal and issue badge
- ✅ Duplicate badge prevention

---

## 🔄 CI/CD Pipeline

GitHub Actions workflow automatically:

1. **Frontend Tests**: Runs Vitest tests and builds React app
2. **Contract Tests**: Compiles and tests Rust contracts
3. **Linting**: Runs ESLint, Prettier, Clippy, and rustfmt
4. **Build Artifacts**: Generates deployable WASM files

Trigger on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

---

## 📸 Screenshots

### Hero Section
![Hero Section](./docs/screenshot-hero.png)

### Wallet Connection
![Wallet Connection](./docs/screenshot-wallet.png)

### Create Goal
![Create Goal](./docs/screenshot-create-goal.png)

### Goals Dashboard
![Goals Dashboard](./docs/screenshot-goals.png)

### Analytics
![Analytics](./docs/screenshot-analytics.png)

### Achievement Badges
![Badges](./docs/screenshot-badges.png)

---

## 🌐 Deployed Contracts

**Stellar Testnet Contract Addresses:**

- **GoalManagerContract**: `<YOUR_CONTRACT_ID_HERE>`
- **RewardBadgeContract**: `<YOUR_CONTRACT_ID_HERE>`

**Example Transaction Hash:** `<TRANSACTION_HASH_HERE>`

[View on Stellar Expert →](https://stellar.expert/explorer/testnet/tx/<TRANSACTION_HASH>)

---

## 🎮 Demo Guide

### Try Without Wallet Installation

1. Visit the application
2. Click **"Try Demo Mode"**
3. Explore all features with a simulated wallet

### Use Freighter Wallet

1. Install [Freighter Wallet](https://www.freighter.app/)
2. Create/import a testnet account
3. Fund account at [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
4. Connect wallet in StellarGoal
5. Create goals and start saving!

---

## 📚 Project Structure

```
stellargoal/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── BadgeSection.jsx
│   │   │   ├── BalanceCard.jsx
│   │   │   ├── CreateGoalForm.jsx
│   │   │   ├── DepositForm.jsx
│   │   │   ├── DepositHistory.jsx
│   │   │   ├── GoalCard.jsx
│   │   │   ├── GoalsList.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── SendXLMForm.jsx
│   │   │   ├── WalletCard.jsx
│   │   │   └── __tests__/
│   │   ├── hooks/
│   │   │   └── useWallet.js
│   │   ├── utils/
│   │   │   ├── stellar.js
│   │   │   └── contractHelpers.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── contracts/
│   ├── goal_manager_contract/
│   │   ├── src/
│   │   │   └── lib.rs
│   │   └── Cargo.toml
│   └── reward_badge_contract/
│       ├── src/
│       │   └── lib.rs
│       └── Cargo.toml
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 Commit Suggestions

Here are 10+ meaningful commit messages for development:

1. `feat: implement Freighter wallet hook with auto-detection`
2. `feat: add GoalManagerContract with create_goal function`
3. `feat: implement RewardBadgeContract with badge issuance`
4. `feat: create goal card component with progress tracking`
5. `feat: add deposit form with XLM amount validation`
6. `feat: implement analytics dashboard with metrics`
7. `feat: add badge section with achievement display`
8. `test: add wallet component unit tests`
9. `test: add contract tests for goal creation and deposit`
10. `style: implement responsive CSS with mobile support`
11. `ci: add GitHub Actions workflow for automated testing`
12. `docs: create comprehensive README with deployment guide`
13. `fix: handle insufficient balance error in send XLM`
14. `refactor: extract stellar utility functions`
15. `feat: add inter-contract communication for badge rewards`

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Stellar Development Foundation** for the amazing blockchain platform
- **Soroban** team for smart contract capabilities
- **Freighter** for the excellent wallet extension
- **React** and **Vite** communities

---

## 📞 Support

For issues or questions:

- 📧 Email: support@stellargoal.example
- 🐛 [GitHub Issues](https://github.com/yourusername/stellargoal/issues)
- 💬 [Discord Community](https://discord.gg/stellargoal)

---

## 🔗 Links

- [Stellar.org](https://stellar.org)
- [Soroban Documentation](https://soroban.stellar.org)
- [Freighter Wallet](https://www.freighter.app/)
- [Stellar Laboratory](https://laboratory.stellar.org)
- [Stellar Expert Explorer](https://stellar.expert/explorer/testnet)

---

**Built with ❤️ on Stellar Testnet**
