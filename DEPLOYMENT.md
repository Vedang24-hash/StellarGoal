# 🚀 StellarGoal Deployment Guide

This guide walks through deploying StellarGoal to production, including smart contracts and frontend hosting.

---

## 📋 Prerequisites

- [x] Stellar Testnet account with XLM balance
- [x] Soroban CLI installed
- [x] Vercel account (for frontend)
- [x] GitHub repository set up

---

## 🔧 Step 1: Deploy Smart Contracts

### 1.1 Configure Soroban CLI

```bash
# Add Testnet network
soroban config network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

### 1.2 Generate Deployer Identity

```bash
# Generate new keypair
soroban keys generate deployer --network testnet

# Get the public key
soroban keys address deployer

# Fund the account
# Visit: https://laboratory.stellar.org/#account-creator?network=test
# Enter your public key and click "Get test network lumens"
```

### 1.3 Build Contracts

```bash
# Build GoalManager
cd contracts/goal_manager_contract
cargo build --target wasm32-unknown-unknown --release

# Build RewardBadge
cd ../reward_badge_contract
cargo build --target wasm32-unknown-unknown --release
```

### 1.4 Deploy Contracts

```bash
# Deploy RewardBadge first (GoalManager depends on it)
cd contracts/reward_badge_contract
REWARD_CONTRACT=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/reward_badge_contract.wasm \
  --source deployer \
  --network testnet)

echo "RewardBadge Contract ID: $REWARD_CONTRACT"

# Deploy GoalManager
cd ../goal_manager_contract
GOAL_CONTRACT=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/goal_manager_contract.wasm \
  --source deployer \
  --network testnet)

echo "GoalManager Contract ID: $GOAL_CONTRACT"
```

### 1.5 Initialize Contracts

```bash
# Initialize GoalManager with RewardBadge address
soroban contract invoke \
  --id $GOAL_CONTRACT \
  --source deployer \
  --network testnet \
  -- initialize \
  --reward_contract $REWARD_CONTRACT

echo "✅ Contracts initialized successfully!"
```

### 1.6 Save Contract IDs

Create a file to save your contract IDs:

```bash
echo "VITE_GOAL_MANAGER_CONTRACT_ID=$GOAL_CONTRACT" > contract-ids.txt
echo "VITE_REWARD_BADGE_CONTRACT_ID=$REWARD_CONTRACT" >> contract-ids.txt
cat contract-ids.txt
```

---

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Configure Environment Variables

Update `frontend/.env`:

```env
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_GOAL_MANAGER_CONTRACT_ID=<YOUR_GOAL_MANAGER_CONTRACT_ID>
VITE_REWARD_BADGE_CONTRACT_ID=<YOUR_REWARD_BADGE_CONTRACT_ID>
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

### 2.3 Deploy to Vercel

```bash
cd frontend

# Login to Vercel
vercel login

# Deploy (first time - follow prompts)
vercel

# For production deployment
vercel --prod
```

### 2.4 Configure Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:
   - `VITE_STELLAR_NETWORK` = `TESTNET`
   - `VITE_STELLAR_RPC_URL` = `https://soroban-testnet.stellar.org`
   - `VITE_NETWORK_PASSPHRASE` = `Test SDF Network ; September 2015`
   - `VITE_GOAL_MANAGER_CONTRACT_ID` = `<your_contract_id>`
   - `VITE_REWARD_BADGE_CONTRACT_ID` = `<your_contract_id>`
   - `VITE_HORIZON_URL` = `https://horizon-testnet.stellar.org`

5. Redeploy from dashboard or CLI: `vercel --prod`

---

## 🔄 Step 3: Set Up CI/CD (Optional)

### 3.1 GitHub Actions Auto-Deploy

Add Vercel token to GitHub Secrets:

1. Get Vercel token: `vercel token`
2. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
3. Add secret: `VERCEL_TOKEN`
4. Update `.github/workflows/ci.yml` to include deployment step

### 3.2 Add Deployment Step to CI

Add to `.github/workflows/ci.yml`:

```yaml
deploy:
  name: Deploy to Vercel
  needs: [frontend-tests, contract-tests]
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
        working-directory: ./frontend
```

---

## ✅ Step 4: Verify Deployment

### 4.1 Test Smart Contracts

```bash
# Test creating a goal
soroban contract invoke \
  --id $GOAL_CONTRACT \
  --source deployer \
  --network testnet \
  -- create_goal \
  --owner <YOUR_STELLAR_ADDRESS> \
  --title "Test Goal" \
  --target_amount 1000000000 \
  --category Emergency

# View contract on Stellar Expert
echo "View contract: https://stellar.expert/explorer/testnet/contract/$GOAL_CONTRACT"
```

### 4.2 Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Connect Freighter wallet
3. Create a test goal
4. Make a deposit
5. Complete the goal
6. Verify badge issuance

---

## 📊 Monitoring & Maintenance

### Contract Monitoring

- View contract calls: [Stellar Expert](https://stellar.expert/explorer/testnet)
- Monitor events emitted by contracts
- Track transaction success rates

### Frontend Monitoring

- Vercel Analytics (automatically enabled)
- Check build logs in Vercel dashboard
- Monitor Core Web Vitals

### Error Tracking

- Add Sentry or similar error tracking
- Monitor wallet connection success rate
- Track failed transactions

---

## 🔐 Security Considerations

### Smart Contracts

- ✅ All contract functions require proper authentication
- ✅ Input validation on all contract methods
- ✅ Prevent duplicate badge issuance
- ✅ Owner verification for goal operations

### Frontend

- ✅ Never expose private keys
- ✅ Validate all user inputs
- ✅ Use HTTPS only
- ✅ Implement rate limiting for API calls

---

## 🚨 Troubleshooting

### Contract Deployment Fails

**Issue:** `Error: Account not found`
**Solution:** Fund your deployer account with testnet XLM

**Issue:** `Error: Transaction failed`
**Solution:** Check fee amount and account balance

### Frontend Build Fails

**Issue:** `Module not found`
**Solution:** Run `npm ci` to ensure clean dependency installation

**Issue:** Environment variables not working
**Solution:** Verify `.env` file exists and variables start with `VITE_`

### Wallet Connection Issues

**Issue:** Freighter not detected
**Solution:** Ensure user has Freighter extension installed and enabled

**Issue:** Wrong network
**Solution:** Switch Freighter to Testnet in extension settings

---

## 📚 Additional Resources

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Laboratory](https://laboratory.stellar.org)
- [Vercel Documentation](https://vercel.com/docs)
- [Freighter Wallet](https://www.freighter.app/)

---

## 🎉 Deployment Complete!

Your StellarGoal dApp is now live! Share your deployment URLs:

- **Frontend:** `https://your-app.vercel.app`
- **GoalManager Contract:** `https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>`
- **RewardBadge Contract:** `https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>`

---

**Need help?** Open an issue on GitHub or reach out to the community!
