# ⭐ StellarGoal - Decentralized Savings Goal Tracker

A production-ready decentralized application (dApp) built on **Stellar Testnet** that empowers users to create, track, and complete savings goals using XLM. Features automated achievement badges through Soroban smart contracts with inter-contract communication.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://stellar-goal.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Stellar](https://img.shields.io/badge/Stellar-Testnet-purple)](https://stellar.org)

**🌐 Live Demo:** [stellar-goal.vercel.app](https://stellar-goal.vercel.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Smart Contracts](#-smart-contracts)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- 🔐 **Wallet Integration** - Freighter wallet with auto-detection and demo mode
- 🎯 **Multi-Goal Management** - Create and track multiple savings goals simultaneously
- 💰 **XLM Deposits** - Secure deposits with real-time balance updates
- 📊 **Progress Tracking** - Visual progress bars and analytics dashboard
- 🏆 **Achievement Badges** - Earn badges through smart contract rewards
- 📱 **Mobile Responsive** - Fully optimized, concise design for all screen sizes
- 🔄 **Real-time Updates** - Auto-refresh balance every 15 seconds
- ⚡ **Transaction Status** - Live transaction tracking with hash links
- 🎨 **Professional UI** - Enhanced button interactions with hover and click effects
- 🔧 **Robust Error Handling** - Advanced URL validation and error recovery

### Advanced Features
- **6 Goal Categories**: Emergency Fund, Vacation, Education, Investment, Purchase, Other
- **Multiple Badge Types**: First Goal, Goal Completer, Milestone achievements (100/500/1000 XLM)
- **Deposit History**: Complete transaction history per goal
- **Network Validation**: Automatic testnet/mainnet detection
- **Enhanced UX**: Smooth button animations, active states, and visual feedback
- **Optimized Mobile**: Compact card layouts with professional spacing for small screens

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite** - Modern, fast development
- **Plain CSS** - No UI libraries, custom responsive design with professional mobile optimization
- **Freighter API** - Wallet integration
- **Stellar SDK** - Blockchain interactions with robust error handling

### Smart Contracts
- **Rust** + **Soroban SDK 21.7.7**
- **Two Contracts**: GoalManager & RewardBadge
- **Inter-contract Communication** - Automated badge issuance
- **Event Streaming** - Real-time contract events

### Infrastructure
- **GitHub Actions** - CI/CD pipeline
- **Vercel** - Frontend hosting
- **Stellar Testnet** - Blockchain network

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Freighter Wallet extension
- Stellar Testnet XLM (get from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test))

### Installation

```bash
# Clone the repository
git clone https://github.com/Vedang24-hash/StellarGoal.git
cd StellarGoal

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173 to see the app!

### Using the App

1. **Connect Wallet** - Click "Connect Wallet" in the navbar
2. **Create Goal** - Click "Create New Goal" and fill in details
3. **Make Deposits** - Click "Deposit" on any active goal
4. **Track Progress** - View analytics and progress bars
5. **Complete Goals** - Click "Complete Goal" when target is reached
6. **Earn Badges** - Badges are automatically issued on completion

**🌐 Live Demo:** https://stellar-goal.vercel.app

---

## 📜 Smart Contracts

### Deployed Contracts (Stellar Testnet)

| Contract | Address | Explorer |
|----------|---------|----------|
| **GoalManager** | `CAEOERCHTGI77GIHJKCASHG5CZMDUM3W3IPIUF2XBN7TKXQKC37FZ7JQ` | [View](https://stellar.expert/explorer/testnet/contract/CAEOERCHTGI77GIHJKCASHG5CZMDUM3W3IPIUF2XBN7TKXQKC37FZ7JQ) |
| **RewardBadge** | `CBVX6QWEUARJ7G54KNXRHSDSNGESDQO2NPVPBY6MEG27XQ5AQSUBMR7Q` | [View](https://stellar.expert/explorer/testnet/contract/CBVX6QWEUARJ7G54KNXRHSDSNGESDQO2NPVPBY6MEG27XQ5AQSUBMR7Q) |

**Example Transaction:** [f8c2afb4...](https://stellar.expert/explorer/testnet/tx/f8c2afb4b8db78c3097a1e87fd69f94c77381615fa3cefc3648f8b49083f75e2)

### Contract Features

#### GoalManagerContract
```rust
// Functions
- create_goal(owner, title, target_amount, category) -> String
- deposit_to_goal(goal_id, depositor, amount)
- complete_goal(goal_id, owner)
- get_goal(goal_id) -> Option<Goal>
- get_goals_by_owner(owner) -> Vec<Goal>
- get_deposit_history(goal_id) -> Vec<Deposit>

// Events
- goal_new(goal_id, owner, target_amount)
- deposited(goal_id, depositor, amount, new_balance)
- completed(goal_id, owner, final_amount)
```

#### RewardBadgeContract
```rust
// Functions
- issue_badge(owner, badge_type, metadata) -> String
- get_badge(badge_id) -> Option<Badge>
- get_badges(owner) -> Vec<Badge>
- get_badge_count(owner) -> u32

// Events
- issued(badge_id, owner, badge_type)
```

---

## 📁 Project Structure

```
StellarGoal/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline
├── contracts/
│   ├── goal_manager_contract/
│   │   ├── src/
│   │   │   └── lib.rs               # GoalManager logic
│   │   └── Cargo.toml
│   └── reward_badge_contract/
│       ├── src/
│       │   └── lib.rs               # RewardBadge logic
│       └── Cargo.toml
├── frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── AnalyticsDashboard.jsx
│   │   │   ├── BadgeSection.jsx
│   │   │   ├── BalanceCard.jsx
│   │   │   ├── CreateGoalForm.jsx
│   │   │   ├── DepositForm.jsx
│   │   │   ├── DepositHistory.jsx
│   │   │   ├── GoalCard.jsx
│   │   │   ├── GoalsList.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProjectInfo.jsx
│   │   │   ├── SendXLMForm.jsx
│   │   │   └── __tests__/          # Component tests
│   │   ├── hooks/
│   │   │   └── useWallet.js        # Wallet connection hook
│   │   ├── utils/
│   │   │   ├── stellar.js          # Stellar SDK utilities
│   │   │   └── contractHelpers.js  # Contract interaction helpers
│   │   ├── App.jsx                  # Main app component
│   │   ├── App.css                  # Global styles
│   │   └── main.jsx                 # Entry point
│   ├── .env                         # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json                  # Vercel config
├── ARCHITECTURE.md                  # System architecture
├── CONTRIBUTING.md                  # Contribution guidelines
├── DEPLOYMENT.md                    # Deployment instructions
├── QUICKSTART.md                    # Quick start guide
├── TROUBLESHOOTING.md               # Common issues
├── deploy-contracts.ps1             # Deployment automation
├── LICENSE                          # MIT License
└── README.md                        # This file
```

---

## 💻 Development

### Recent Updates (January 2026)

#### 🐛 Bug Fixes
- **Fixed Console Errors**: Resolved `TypeError: Failed to fetch. URL scheme "type" is not supported`
  - Added robust URL sanitization in `stellar.js`
  - Implemented regex patterns to clean Horizon URL (removes "type:" prefix, quotes, whitespace)
  - Added console logging for debugging URL configuration

#### 🎨 UI/UX Improvements
- **Enhanced Button Visibility**:
  - Fixed navbar button text visibility (Send XLM, Disconnect Wallet)
  - Added `!important` color declarations for proper contrast
  - Improved button text readability across all themes

- **Interactive Button Effects**:
  - Added smooth hover effects with lift animation (`translateY(-2px)`)
  - Implemented click/active states with press effect
  - Enhanced shadows on interaction for better visual feedback
  - Applied to all button types (primary, secondary, success, danger, navbar)

#### 📱 Mobile Responsiveness Overhaul
- **Optimized for Professional Mobile Experience**:
  - Reduced card padding by 60% (from `lg` to `md` spacing)
  - Decreased spacing variables for compact layouts:
    - `--spacing-md`: 0.75rem → 0.6rem
    - `--spacing-lg`: 1rem → 0.85rem
    - `--spacing-xl`: 1.25rem → 1rem
  - Minimized form inputs and button sizes
  - Compact goal cards with tighter spacing
  - Reduced analytics stats font sizes for better fit
  - Optimized badge grid for small screens
  - Single-column layouts for narrow viewports

- **Extra Small Devices (≤380px)**:
  - Ultra-compact spacing (xs: 0.1rem)
  - Single column badge layout
  - Minimal padding throughout
  - Optimized for very small screens

### Environment Setup

Create `frontend/.env`:
```env
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_GOAL_MANAGER_CONTRACT_ID=<your-contract-id>
VITE_REWARD_BADGE_CONTRACT_ID=<your-contract-id>
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run tests

# Contracts
cargo build --target wasm32-unknown-unknown --release
cargo test          # Run contract tests
cargo fmt           # Format code
cargo clippy        # Lint code
```

---

## 🧪 Testing

### Frontend Tests (Vitest + React Testing Library)
```bash
cd frontend
npm test
```

**Tests:**
- ✅ WalletCard component
- ✅ CreateGoalForm validation
- ✅ GoalCard rendering

### Contract Tests (Rust)
```bash
cd contracts/goal_manager_contract
cargo test

cd ../reward_badge_contract
cargo test
```

**Tests:**
- ✅ Create goal
- ✅ Deposit to goal
- ✅ Complete goal
- ✅ Issue badge
- ✅ Get badges
- ✅ Duplicate prevention

**Total: 6 passing tests**

---

## 🚀 Deployment

### Smart Contracts

```bash
# Install Stellar CLI
cargo install --locked stellar-cli

# Configure testnet
stellar network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate deployer identity
stellar keys generate deployer --network testnet

# Fund deployer account
stellar keys address deployer
# Visit: https://laboratory.stellar.org/#account-creator?network=test

# Deploy contracts
stellar contract deploy \
  --wasm contracts/reward_badge_contract/target/wasm32-unknown-unknown/release/reward_badge_contract.wasm \
  --source deployer \
  --network testnet

stellar contract deploy \
  --wasm contracts/goal_manager_contract/target/wasm32-unknown-unknown/release/goal_manager_contract.wasm \
  --source deployer \
  --network testnet
```

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

Or use Vercel Dashboard:
1. Import GitHub repository
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy

---

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and architecture
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Detailed deployment guide
- **[QUICKSTART.md](./QUICKSTART.md)** - 5-minute quick start
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute
- **[DEPLOYMENT_NOTES.md](./DEPLOYMENT_NOTES.md)** - Current deployment status

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Stellar Development Foundation** - Blockchain platform
- **Soroban** - Smart contract framework
- **Freighter** - Wallet integration
- **React** & **Vite** - Frontend tools

---

## 📝 Changelog

### Version 1.1.0 (January 2026)

#### Bug Fixes
- 🐛 Fixed critical console error: "URL scheme 'type' is not supported"
  - Implemented advanced URL sanitization in Stellar utility
  - Added regex patterns for cleaning malformed URLs
  - Enhanced error logging for debugging

#### UI/UX Enhancements
- ✨ Fixed navbar button text visibility issues
  - Send XLM button now displays text correctly
  - Disconnect Wallet button has proper contrast
- 🎯 Added interactive button effects
  - Hover: Lift animation with enhanced shadows
  - Active: Press effect with visual feedback
  - Smooth transitions on all interactions
- 📱 Major mobile responsiveness improvements
  - 60% reduction in card padding for compact layouts
  - Optimized spacing for professional appearance
  - Enhanced readability on small screens
  - Ultra-compact mode for devices ≤380px

#### Technical Improvements
- 🔧 Enhanced Horizon URL validation and cleanup
- 📊 Improved mobile layout efficiency
- 🎨 Refined CSS architecture for better maintainability

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/Vedang24-hash/StellarGoal/issues)
- **Stellar Discord:** [discord.gg/stellar](https://discord.gg/stellar)
- **Documentation:** [Soroban Docs](https://soroban.stellar.org)

---

## 🔗 Links

- **Live Demo:** https://stellar-goal.vercel.app
- **GitHub:** https://github.com/Vedang24-hash/StellarGoal
- **Stellar Expert:** [View Contracts](https://stellar.expert/explorer/testnet)
- **Stellar Laboratory:** [Get Testnet XLM](https://laboratory.stellar.org)

---

**Built with ❤️ on Stellar Testnet**

*StellarGoal - Empowering financial goals through blockchain technology*
