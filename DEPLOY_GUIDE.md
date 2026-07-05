# 🚀 Complete Deployment Guide - StellarGoal

This guide will walk you through deploying your smart contracts to Stellar Testnet and your frontend to Vercel.

---

## Part 1: Install Soroban CLI

### Windows Installation:

```powershell
# Install Soroban CLI
cargo install --locked soroban-cli --features opt

# Add wasm target (if not already added)
rustup target add wasm32-unknown-unknown

# Verify installation
soroban --version
```

This may take 10-15 minutes to compile. ☕

---

## Part 2: Deploy Smart Contracts to Stellar Testnet

### Step 1: Configure Soroban for Testnet

```powershell
# Navigate to project root
cd f:\vedang\StellarGoal

# Add testnet network configuration
soroban network add testnet `
  --rpc-url https://soroban-testnet.stellar.org `
  --network-passphrase "Test SDF Network ; September 2015"

# Verify network was added
soroban network ls
```

### Step 2: Generate Deployment Identity

```powershell
# Generate a new keypair for deployment
soroban keys generate deployer --network testnet

# Get the public key (you'll need this for funding)
soroban keys address deployer
```

**Copy this address!** You'll need it in the next step.

### Step 3: Fund Your Deployer Account

1. Visit: https://laboratory.stellar.org/#account-creator?network=test
2. Paste your deployer public key
3. Click "Get test network lumens"
4. Wait for confirmation (should be instant)

Verify balance:
```powershell
soroban keys address deployer | %{ curl "https://horizon-testnet.stellar.org/accounts/$_" }
```

### Step 4: Build Smart Contracts

```powershell
# Build RewardBadge Contract
cd contracts\reward_badge_contract
cargo build --target wasm32-unknown-unknown --release

# Build GoalManager Contract
cd ..\goal_manager_contract
cargo build --target wasm32-unknown-unknown --release

# Return to project root
cd ..\..
```

### Step 5: Deploy RewardBadge Contract (Deploy First!)

```powershell
cd contracts\reward_badge_contract

soroban contract deploy `
  --wasm target\wasm32-unknown-unknown\release\reward_badge_contract.wasm `
  --source deployer `
  --network testnet
```

**📝 IMPORTANT:** Copy the contract ID that's returned! It looks like:
```
CXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Save it as: `REWARD_BADGE_CONTRACT_ID`

### Step 6: Deploy GoalManager Contract

```powershell
cd ..\goal_manager_contract

soroban contract deploy `
  --wasm target\wasm32-unknown-unknown\release\goal_manager_contract.wasm `
  --source deployer `
  --network testnet
```

**📝 IMPORTANT:** Copy this contract ID too!

Save it as: `GOAL_MANAGER_CONTRACT_ID`

### Step 7: Initialize GoalManager with RewardBadge Address

```powershell
# Replace <GOAL_MANAGER_ID> and <REWARD_BADGE_ID> with your actual IDs
soroban contract invoke `
  --id <GOAL_MANAGER_CONTRACT_ID> `
  --source deployer `
  --network testnet `
  -- initialize `
  --reward_contract <REWARD_BADGE_CONTRACT_ID>
```

**✅ Smart Contracts Deployed!**

---

## Part 3: Update Frontend Environment Variables

### Step 1: Update .env file

```powershell
cd f:\vedang\StellarGoal\frontend
```

Edit `frontend\.env` and add your deployed contract IDs:

```env
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_GOAL_MANAGER_CONTRACT_ID=<YOUR_GOAL_MANAGER_CONTRACT_ID_HERE>
VITE_REWARD_BADGE_CONTRACT_ID=<YOUR_REWARD_BADGE_CONTRACT_ID_HERE>
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

### Step 2: Test Locally

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 and test:
1. Connect wallet
2. Create a goal
3. Make a deposit
4. Complete a goal

---

## Part 4: Deploy Frontend to Vercel

### Option A: Using Vercel CLI (Recommended)

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? stellargoal (or your choice)
# - Directory? ./ (current directory)
# - Override settings? N

# After first deployment, set environment variables:
vercel env add VITE_STELLAR_NETWORK
# Enter: TESTNET

vercel env add VITE_STELLAR_RPC_URL
# Enter: https://soroban-testnet.stellar.org

vercel env add VITE_NETWORK_PASSPHRASE
# Enter: Test SDF Network ; September 2015

vercel env add VITE_GOAL_MANAGER_CONTRACT_ID
# Enter: <your contract id>

vercel env add VITE_REWARD_BADGE_CONTRACT_ID
# Enter: <your contract id>

vercel env add VITE_HORIZON_URL
# Enter: https://horizon-testnet.stellar.org

# Deploy to production
vercel --prod
```

### Option B: Using Vercel Dashboard (Easier)

1. **Push your code to GitHub:**
   ```powershell
   cd f:\vedang\StellarGoal
   git add .
   git commit -m "chore: configure for deployment"
   git push origin master
   ```

2. **Go to Vercel:**
   - Visit: https://vercel.com
   - Click "Add New Project"
   - Import your GitHub repository: `Vedang24-hash/StellarGoal`

3. **Configure Project:**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `VITE_STELLAR_NETWORK` | `TESTNET` |
   | `VITE_STELLAR_RPC_URL` | `https://soroban-testnet.stellar.org` |
   | `VITE_NETWORK_PASSPHRASE` | `Test SDF Network ; September 2015` |
   | `VITE_GOAL_MANAGER_CONTRACT_ID` | `<your-contract-id>` |
   | `VITE_REWARD_BADGE_CONTRACT_ID` | `<your-contract-id>` |
   | `VITE_HORIZON_URL` | `https://horizon-testnet.stellar.org` |

5. **Click "Deploy"**

Wait 2-3 minutes for build to complete.

**✅ Frontend Deployed!**

Your app will be live at: `https://stellargoal-xxxxx.vercel.app`

---

## Part 5: Verify Deployment

### Test Your Live App:

1. Visit your Vercel URL
2. Install Freighter wallet (if not already)
3. Switch to Testnet in Freighter
4. Connect wallet
5. Create a test goal
6. Make a deposit
7. Complete the goal
8. Verify badge is earned

### Get Transaction Hash:

1. After any transaction, check the browser console
2. Look for transaction hash starting with: `0x...`
3. Visit: `https://stellar.expert/explorer/testnet/tx/<your-hash>`
4. Copy the full URL for your submission

---

## Part 6: Update README with Deployment Info

Edit `README.md` and update:

```markdown
## 🌐 Deployed Contracts

**Stellar Testnet Contract Addresses:**

- **GoalManagerContract**: `<YOUR_GOAL_MANAGER_CONTRACT_ID>`
- **RewardBadgeContract**: `<YOUR_REWARD_BADGE_CONTRACT_ID>`

**Live Demo:** https://stellargoal-xxxxx.vercel.app

**Example Transaction Hash:** `<YOUR_TRANSACTION_HASH>`

[View on Stellar Expert →](https://stellar.expert/explorer/testnet/tx/<TRANSACTION_HASH>)
```

Commit and push:
```powershell
git add README.md
git commit -m "docs: add deployed contract addresses and live demo link"
git push origin master
```

---

## 🎉 Deployment Complete!

You now have:
- ✅ Smart contracts deployed to Stellar Testnet
- ✅ Frontend deployed to Vercel
- ✅ Live demo URL
- ✅ Contract addresses
- ✅ Transaction hashes

---

## 📸 Next Steps:

1. **Take Screenshots:**
   - Mobile responsive view
   - Wallet connected
   - Goals dashboard
   - CI/CD pipeline (from GitHub Actions tab)

2. **Record Demo Video:**
   - Use OBS Studio or Loom
   - Show: wallet connect → create goal → deposit → complete
   - 1-2 minutes max

3. **Submit Your Project! 🚀**

---

## 🆘 Troubleshooting

### Issue: Soroban CLI won't install
**Solution:** Make sure you have the latest Rust:
```powershell
rustup update
```

### Issue: Contract deployment fails
**Solution:** Check you have testnet XLM:
```powershell
soroban keys address deployer | %{ curl "https://horizon-testnet.stellar.org/accounts/$_" }
```

### Issue: Vercel build fails
**Solution:** Check environment variables are set correctly in Vercel dashboard.

### Issue: Can't connect wallet in deployed app
**Solution:** Make sure you're on Stellar Testnet in Freighter wallet settings.

---

## 📞 Need Help?

- Stellar Discord: https://discord.gg/stellar
- Soroban Docs: https://soroban.stellar.org
- Vercel Support: https://vercel.com/support

Good luck! 🌟
