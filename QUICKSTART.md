# ⚡ StellarGoal Quick Start Guide

Get StellarGoal running locally in under 5 minutes!

---

## 🚀 Prerequisites

Before you begin, ensure you have:
- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **npm** or **yarn** package manager
- ✅ **Git** installed
- ✅ (Optional) **Freighter Wallet** extension ([Install](https://www.freighter.app/))

---

## 📦 Installation (3 Steps)

### Step 1: Clone & Navigate

```bash
git clone https://github.com/yourusername/stellargoal.git
cd stellargoal/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

**That's it!** 🎉 Open [http://localhost:3000](http://localhost:3000)

---

## 🎮 Using the App (Demo Mode)

### No Wallet Needed - Try Demo Mode!

1. **Click "Try Demo Mode"** on the landing page
2. **Create a Goal**
   - Click "Create New Goal"
   - Enter title: "Emergency Fund"
   - Enter target: 1000 XLM
   - Select category
   - Click "Create Goal"

3. **Make a Deposit**
   - Click "💰 Deposit" on your goal
   - Enter amount: 100
   - Click "Deposit"
   - Watch progress bar update!

4. **Complete Goal**
   - Keep depositing until target reached
   - Click "✓ Complete Goal"
   - Earn your first badge! 🏆

5. **Explore Features**
   - View Analytics Dashboard
   - Check Achievement Badges
   - See Deposit History

---

## 🦊 Using with Freighter Wallet

### Setup Freighter (2 minutes)

1. **Install Extension**
   - Visit [freighter.app](https://www.freighter.app/)
   - Install for your browser
   - Create or import wallet

2. **Switch to Testnet**
   - Open Freighter
   - Click settings (gear icon)
   - Select "Testnet"

3. **Fund Your Account**
   - Visit [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
   - Paste your public key
   - Click "Get test network lumens"
   - Wait for confirmation

4. **Connect to StellarGoal**
   - Click "Connect Freighter"
   - Approve connection in Freighter popup
   - You're connected! ✅

---

## 🧪 Running Tests

### Frontend Tests

```bash
cd frontend
npm test
```

### Smart Contract Tests

```bash
# Install Rust (if not installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Test GoalManager
cd contracts/goal_manager_contract
cargo test

# Test RewardBadge
cd ../reward_badge_contract
cargo test
```

---

## 🔧 Configuration (Optional)

### Environment Variables

Edit `frontend/.env`:

```env
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org

# Add these after deploying contracts
VITE_GOAL_MANAGER_CONTRACT_ID=YOUR_CONTRACT_ID
VITE_REWARD_BADGE_CONTRACT_ID=YOUR_CONTRACT_ID
```

---

## 📱 Features to Try

### ✅ Wallet Management
- [x] Connect Freighter wallet
- [x] Try demo mode
- [x] View XLM balance
- [x] Disconnect wallet

### ✅ Goals
- [x] Create multiple goals
- [x] Choose different categories
- [x] Deposit to goals
- [x] Track progress
- [x] Complete goals
- [x] View deposit history

### ✅ Transactions
- [x] Send XLM to addresses
- [x] View transaction hash
- [x] Check on Stellar Expert

### ✅ Achievements
- [x] Earn badges
- [x] View all badges
- [x] Track milestones

### ✅ Analytics
- [x] Total goals
- [x] Active/completed counts
- [x] Total XLM saved

---

## 🐛 Troubleshooting

### "Cannot find module" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use
```bash
# Edit vite.config.js and change port
# Or kill process on port 3000
```

### Wallet not connecting
- Ensure Freighter is installed and unlocked
- Check you're on Testnet
- Try refreshing the page

### Balance shows 0
- Fund your account at Stellar Laboratory
- Wait 5-10 seconds for confirmation
- Click refresh balance button

---

## 📚 Next Steps

1. ✅ **Read Full Documentation:** [README.md](README.md)
2. ✅ **Deploy Contracts:** [DEPLOYMENT.md](DEPLOYMENT.md)
3. ✅ **Understand Architecture:** [ARCHITECTURE.md](ARCHITECTURE.md)
4. ✅ **Contribute:** [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 🎯 Common Tasks

### Create a Production Build
```bash
npm run build
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Run Linting
```bash
npm run lint
```

### View in Browser
- **Development:** http://localhost:3000
- **Preview:** http://localhost:4173

---

## 💡 Tips

- 🎮 **Start with Demo Mode** to understand features
- 🦊 **Use Freighter** for real blockchain experience
- 📊 **Check Analytics** to see your progress
- 🏆 **Collect all badges** for full experience
- 📱 **Try mobile view** - fully responsive!

---

## ❓ Need Help?

- 📖 **Documentation:** Check README.md
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/stellargoal/issues)
- 💬 **Community:** Join our Discord
- 📧 **Email:** support@stellargoal.example

---

## 🎉 You're Ready!

Congratulations! You now have StellarGoal running locally. Start creating savings goals and tracking your progress on the blockchain! 🚀

**Happy Saving with Stellar!** ⭐

---

[← Back to README](README.md) | [Deployment Guide →](DEPLOYMENT.md)
