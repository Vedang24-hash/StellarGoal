# StellarGoal Smart Contract Deployment Script
# Run this script to deploy contracts to Stellar Testnet

Write-Host "🚀 StellarGoal Contract Deployment Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Soroban CLI is installed
Write-Host "Checking Soroban CLI installation..." -ForegroundColor Yellow
try {
    $sorobanVersion = soroban --version
    Write-Host "✅ Soroban CLI installed: $sorobanVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Soroban CLI not found!" -ForegroundColor Red
    Write-Host "Please install it with: cargo install --locked soroban-cli" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 1: Configure Network
Write-Host "Step 1: Configuring Stellar Testnet..." -ForegroundColor Yellow
try {
    soroban network add testnet `
        --rpc-url https://soroban-testnet.stellar.org `
        --network-passphrase "Test SDF Network ; September 2015" 2>$null
    Write-Host "✅ Testnet configured" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ Testnet already configured (this is OK)" -ForegroundColor Cyan
}

Write-Host ""

# Step 2: Generate or use existing deployer identity
Write-Host "Step 2: Setting up deployer identity..." -ForegroundColor Yellow
try {
    $deployerAddress = soroban keys address deployer 2>$null
    if ($deployerAddress) {
        Write-Host "✅ Using existing deployer: $deployerAddress" -ForegroundColor Green
    }
} catch {
    Write-Host "Creating new deployer identity..." -ForegroundColor Yellow
    soroban keys generate deployer --network testnet
    $deployerAddress = soroban keys address deployer
    Write-Host "✅ Deployer created: $deployerAddress" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️ IMPORTANT: Fund this address with testnet XLM!" -ForegroundColor Red
    Write-Host "Visit: https://laboratory.stellar.org/#account-creator?network=test" -ForegroundColor Yellow
    Write-Host "Paste address: $deployerAddress" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after funding the account"
}

Write-Host ""

# Step 3: Build Contracts
Write-Host "Step 3: Building smart contracts..." -ForegroundColor Yellow

Write-Host "Building RewardBadge Contract..." -ForegroundColor Cyan
Set-Location "contracts\reward_badge_contract"
cargo build --target wasm32-unknown-unknown --release --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ RewardBadge Contract built" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed for RewardBadge Contract" -ForegroundColor Red
    exit 1
}

Write-Host "Building GoalManager Contract..." -ForegroundColor Cyan
Set-Location "..\goal_manager_contract"
cargo build --target wasm32-unknown-unknown --release --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ GoalManager Contract built" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed for GoalManager Contract" -ForegroundColor Red
    exit 1
}

Set-Location "..\..\"

Write-Host ""

# Step 4: Deploy RewardBadge Contract
Write-Host "Step 4: Deploying RewardBadge Contract to Stellar Testnet..." -ForegroundColor Yellow
Set-Location "contracts\reward_badge_contract"

$rewardBadgeId = soroban contract deploy `
    --wasm target\wasm32-unknown-unknown\release\reward_badge_contract.wasm `
    --source deployer `
    --network testnet

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ RewardBadge Contract deployed!" -ForegroundColor Green
    Write-Host "Contract ID: $rewardBadgeId" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "❌ Deployment failed for RewardBadge Contract" -ForegroundColor Red
    Write-Host "Make sure your deployer account is funded!" -ForegroundColor Yellow
    exit 1
}

Set-Location "..\..\"

# Step 5: Deploy GoalManager Contract
Write-Host "Step 5: Deploying GoalManager Contract to Stellar Testnet..." -ForegroundColor Yellow
Set-Location "contracts\goal_manager_contract"

$goalManagerId = soroban contract deploy `
    --wasm target\wasm32-unknown-unknown\release\goal_manager_contract.wasm `
    --source deployer `
    --network testnet

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ GoalManager Contract deployed!" -ForegroundColor Green
    Write-Host "Contract ID: $goalManagerId" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "❌ Deployment failed for GoalManager Contract" -ForegroundColor Red
    exit 1
}

Set-Location "..\..\"

# Step 6: Initialize GoalManager
Write-Host "Step 6: Initializing GoalManager with RewardBadge address..." -ForegroundColor Yellow
Write-Host "Note: This step is commented out in the contract, so we'll skip it for now" -ForegroundColor Cyan
Write-Host ""

# Uncomment when inter-contract call is activated:
# soroban contract invoke `
#     --id $goalManagerId `
#     --source deployer `
#     --network testnet `
#     -- initialize `
#     --reward_contract $rewardBadgeId

# Step 7: Save to .env file
Write-Host "Step 7: Updating frontend .env file..." -ForegroundColor Yellow

$envContent = @"
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_GOAL_MANAGER_CONTRACT_ID=$goalManagerId
VITE_REWARD_BADGE_CONTRACT_ID=$rewardBadgeId
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
"@

$envContent | Out-File -FilePath "frontend\.env" -Encoding UTF8
Write-Host "✅ .env file updated" -ForegroundColor Green

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Contract Addresses:" -ForegroundColor Yellow
Write-Host "RewardBadge: $rewardBadgeId" -ForegroundColor Cyan
Write-Host "GoalManager: $goalManagerId" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 Contract IDs saved to: frontend\.env" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔗 View on Stellar Expert:" -ForegroundColor Yellow
Write-Host "https://stellar.expert/explorer/testnet/contract/$goalManagerId" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. cd frontend" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. npm run dev" -ForegroundColor White
Write-Host "4. Test locally, then deploy to Vercel!" -ForegroundColor White
Write-Host ""
Write-Host "To deploy to Vercel:" -ForegroundColor Yellow
Write-Host "1. npm install -g vercel" -ForegroundColor White
Write-Host "2. cd frontend" -ForegroundColor White
Write-Host "3. vercel" -ForegroundColor White
Write-Host ""
