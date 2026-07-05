# ⚡ Quick Start - Deploy in 30 Minutes

Follow these steps in order to deploy your StellarGoal dApp.

---

## Prerequisites Checklist

- [ ] Rust installed (`rustc --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git installed and GitHub repo connected
- [ ] Freighter wallet extension installed

---

## 🎯 Step-by-Step Deployment

### 1️⃣ Install Soroban CLI (10 minutes)

```powershell
# This will take 10-15 minutes to compile
cargo install --locked soroban-cli

# Verify installation
soroban --version
```

☕ **Grab a coffee while this installs...**

---

### 2️⃣ Deploy Smart Contracts (10 minutes)

```powershell
# Navigate to project directory
cd f:\vedang\StellarGoal

# Run automated deployment script
.\deploy-contracts.ps1
```

**What this script does:**
1. ✅ Configures Stellar Testnet
2. ✅ Creates deployer identity
3. ✅ Builds both contracts
4. ✅ Deploys to testnet
5. ✅ Updates frontend .env file

**⚠️ IMPORTANT:** When prompted, fund your deployer address:
- Visit: https://laboratory.stellar.org/#account-creator?network=test
- Paste your address
- Click "Get test network lumens"
- Press Enter to continue

**📝 Save these contract IDs** (script will display them):
- RewardBadge Contract ID
- GoalManager Contract ID

---

### 3️⃣ Test Locally (5 minutes)

```powershell
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 and test:
- [ ] Connect Freighter wallet
- [ ] Create a savings goal
- [ ] Make a deposit
- [ ] View analytics

---

### 4️⃣ Deploy to Vercel (5 minutes)

#### Option A: Vercel CLI (Faster)

```powershell
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod

# The deployment URL will be shown
```

#### Option B: Vercel Dashboard (Easier)

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import: `Vedang24-hash/StellarGoal`
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add Environment Variables:
   ```
   VITE_STELLAR_NETWORK = TESTNET
   VITE_STELLAR_RPC_URL = https://soroban-testnet.stellar.org
   VITE_NETWORK_PASSPHRASE = Test SDF Network ; September 2015
   VITE_GOAL_MANAGER_CONTRACT_ID = <your-contract-id>
   VITE_REWARD_BADGE_CONTRACT_ID = <your-contract-id>
   VITE_HORIZON_URL = https://horizon-testnet.stellar.org
   ```

6. Click **Deploy**

Wait 2-3 minutes... ☕

**🎉 Your app is live!**

Copy your deployment URL: `https://stellargoal-xxxxx.vercel.app`

---

## 5️⃣ Get Transaction Hash

1. Open your deployed app
2. Connect Freighter wallet (make sure you're on Testnet)
3. Create a goal
4. Open browser DevTools (F12)
5. Look in Console for transaction hash
6. Copy the hash (starts with a long string)

Visit: `https://stellar.expert/explorer/testnet/tx/<your-hash>`

---

## 6️⃣ Update README

Edit `README.md` and replace placeholders:

```markdown
## 🌐 Deployed Contracts

**Stellar Testnet Contract Addresses:**

- **GoalManagerContract**: `CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- **RewardBadgeContract**: `CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

**Live Demo:** https://stellargoal-xxxxx.vercel.app

**Example Transaction Hash:** `abc123...xyz`

[View on Stellar Expert →](https://stellar.expert/explorer/testnet/tx/abc123...xyz)
```

Commit and push:
```powershell
git add README.md
git commit -m "docs: add deployment links and contract addresses"
git push origin master
```

---

## 7️⃣ Final Checklist for Submission

- [ ] Smart contracts deployed to Stellar Testnet
- [ ] Contract IDs documented in README
- [ ] Frontend deployed to Vercel
- [ ] Live demo URL in README
- [ ] Transaction hash captured and documented
- [ ] GitHub repo has 3+ commits
- [ ] CI/CD pipeline ran successfully
- [ ] Tests passing (run `npm test` in frontend)

---

## 📸 Screenshots Needed

Take screenshots of:

1. **Mobile responsive UI** - Open deployed app in phone or DevTools mobile view
2. **Wallet connected** - Show wallet address in navbar
3. **Goals dashboard** - Show goals with progress bars
4. **CI/CD pipeline** - Go to GitHub repo → Actions tab → screenshot workflow

---

## 🎥 Demo Video (Optional but Recommended)

Record 1-2 minute video showing:
1. Connect wallet
2. Create a goal
3. Deposit XLM
4. View progress
5. Complete goal

Use: Loom, OBS Studio, or Windows Game Bar (Win+G)

---

## 🆘 Troubleshooting

### Script says "Soroban not found"
Run: `cargo install --locked soroban-cli`
Wait 10-15 minutes for installation

### Contract deployment fails
Make sure you funded your deployer address with testnet XLM

### Vercel build fails
Check environment variables are set correctly in Vercel dashboard

### Wallet won't connect in deployed app
Make sure Freighter is on Testnet network

---

## ✅ You're Done!

Your submission is complete when:
- ✅ Contracts deployed
- ✅ Frontend live on Vercel
- ✅ README updated with links
- ✅ Transaction hash documented
- ✅ Screenshots captured

**🚀 Submit your project!**

---

## 📞 Need Help?

See detailed guide: `DEPLOY_GUIDE.md`

Common issues: `TROUBLESHOOTING.md`
