# 🔧 StellarGoal Troubleshooting Guide

Common issues and solutions for StellarGoal development and deployment.

---

## 🦊 Wallet Connection Issues

### Issue: "Freighter Extension Not Found"

**Symptoms:**
- Error message about missing Freighter
- Cannot connect wallet

**Solutions:**

1. **Install Freighter Extension**
   ```
   Visit: https://www.freighter.app/
   Install extension for your browser
   ```

2. **Enable Extension**
   - Check browser extensions list
   - Ensure Freighter is enabled
   - Refresh the page

3. **Try Demo Mode**
   - Click "Try Demo Mode" to test without wallet
   - Use for development/testing

### Issue: "Connection Request Declined"

**Symptoms:**
- Wallet connection fails
- "User declined" error

**Solutions:**

1. **Try Again**
   - Click connect button again
   - Approve in Freighter popup

2. **Check Wallet Status**
   - Ensure Freighter is unlocked
   - Check wallet has an account

3. **Clear Browser Cache**
   - Clear site data
   - Refresh page
   - Reconnect wallet

### Issue: "Wrong Network Detected"

**Symptoms:**
- Red network indicator
- "Please switch to Testnet" message

**Solutions:**

1. **Switch Network in Freighter**
   - Open Freighter extension
   - Click settings (gear icon)
   - Select "Testnet"
   - Refresh page

2. **Verify Network**
   - Check network badge shows "TESTNET ✓"
   - Should be green, not red

---

## 💰 Balance & Transaction Issues

### Issue: Balance Shows 0 XLM

**Symptoms:**
- Connected wallet shows 0 XLM
- Cannot make transactions

**Solutions:**

1. **Fund Testnet Account**
   ```
   Visit: https://laboratory.stellar.org/#account-creator?network=test
   1. Paste your public key
   2. Click "Get test network lumens"
   3. Wait 5-10 seconds
   4. Refresh balance in app
   ```

2. **Check Network**
   - Ensure on Testnet, not Mainnet
   - Testnet XLM is free

3. **Wait for Confirmation**
   - Initial funding takes 5-10 seconds
   - Click refresh balance button
   - Check Stellar Expert for account

### Issue: "Insufficient Balance" Error

**Symptoms:**
- Transaction fails with balance error
- Cannot send or deposit

**Solutions:**

1. **Check Balance**
   - Ensure balance > amount + fees
   - Stellar requires 1 XLM minimum reserve
   - Transaction fee is ~0.01 XLM

2. **Reduce Amount**
   - Try smaller amount
   - Leave at least 1.1 XLM in account

3. **Get More Testnet XLM**
   - Use Stellar Laboratory again
   - Friendbot provides test XLM

### Issue: Transaction Hangs or Fails

**Symptoms:**
- "Sending..." never completes
- Transaction timeout error

**Solutions:**

1. **Check Network Connection**
   - Verify internet connection
   - Check Stellar status: https://status.stellar.org/

2. **Try Again**
   - Wait 30 seconds
   - Retry transaction

3. **Check Horizon Status**
   - Horizon API might be down
   - Wait and retry later

---

## 🎯 Goal Management Issues

### Issue: Goals Not Appearing

**Symptoms:**
- Created goals don't show
- Empty goals list

**Solutions:**

1. **Check LocalStorage**
   ```javascript
   // In browser console:
   console.log(localStorage.getItem('stellargoal_goals'))
   ```

2. **Refresh Page**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

3. **Clear and Recreate**
   ```javascript
   // In browser console (warning: deletes all data):
   localStorage.clear()
   ```
   - Refresh page
   - Reconnect wallet
   - Create goals again

### Issue: Deposit Not Updating Progress

**Symptoms:**
- Deposit successful but progress unchanged
- Balance not updating

**Solutions:**

1. **Refresh Page**
   - Page refresh loads latest data

2. **Check Goal ID Match**
   - Verify correct goal selected

3. **View Deposit History**
   - Click "History" button
   - Verify deposit recorded

---

## 🏗️ Build & Development Issues

### Issue: "npm install" Fails

**Symptoms:**
- Dependency installation errors
- Package resolution failures

**Solutions:**

1. **Clear npm Cache**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node Version**
   ```bash
   node --version  # Should be 18+
   npm --version
   ```

3. **Use Different Package Manager**
   ```bash
   npm install -g yarn
   yarn install
   ```

### Issue: "Module not found" Error

**Symptoms:**
- Import errors in console
- Application won't start

**Solutions:**

1. **Reinstall Dependencies**
   ```bash
   cd frontend
   rm -rf node_modules
   npm install
   ```

2. **Check Import Paths**
   - Verify file exists
   - Check import path is correct

3. **Restart Dev Server**
   ```bash
   npm run dev
   ```

### Issue: Port 3000 Already in Use

**Symptoms:**
- "EADDRINUSE: address already in use"
- Dev server won't start

**Solutions:**

1. **Kill Process on Port 3000** (Windows)
   ```powershell
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Kill Process on Port 3000** (Mac/Linux)
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

3. **Use Different Port**
   ```bash
   # Edit vite.config.js
   server: { port: 3001 }
   ```

---

## 🧪 Testing Issues

### Issue: Tests Failing

**Symptoms:**
- Test suite errors
- Component tests fail

**Solutions:**

1. **Check Test Setup**
   ```bash
   cd frontend
   npm test
   ```

2. **Install Test Dependencies**
   ```bash
   npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
   ```

3. **Clear Test Cache**
   ```bash
   rm -rf node_modules/.vite
   npm test
   ```

### Issue: Contract Tests Failing

**Symptoms:**
- Rust tests fail
- Compilation errors

**Solutions:**

1. **Update Rust**
   ```bash
   rustup update
   rustup target add wasm32-unknown-unknown
   ```

2. **Clean Build**
   ```bash
   cargo clean
   cargo test
   ```

3. **Check Soroban Version**
   ```bash
   cargo install --locked soroban-cli
   ```

---

## 🚀 Deployment Issues

### Issue: Vercel Build Fails

**Symptoms:**
- Deployment fails on Vercel
- Build errors

**Solutions:**

1. **Check Build Locally**
   ```bash
   cd frontend
   npm run build
   ```

2. **Verify Environment Variables**
   - Check all VITE_ variables set
   - Verify contract IDs are correct

3. **Check Build Logs**
   - Review Vercel dashboard logs
   - Fix reported errors

### Issue: Contract Deployment Fails

**Symptoms:**
- Soroban deploy errors
- "Account not found"

**Solutions:**

1. **Fund Deployer Account**
   ```bash
   # Get public key
   soroban keys address deployer
   
   # Fund at Stellar Laboratory
   # Visit: https://laboratory.stellar.org/#account-creator?network=test
   ```

2. **Check Network Config**
   ```bash
   soroban config network list
   ```

3. **Verify WASM Build**
   ```bash
   cargo build --target wasm32-unknown-unknown --release
   ls target/wasm32-unknown-unknown/release/*.wasm
   ```

---

## 🐛 Common Errors

### Error: "Network request failed"

**Cause:** Horizon/Soroban RPC unreachable

**Solution:**
1. Check internet connection
2. Verify RPC URL in .env
3. Check https://status.stellar.org/
4. Try alternative RPC endpoint

### Error: "Transaction sequence mismatch"

**Cause:** Concurrent transactions or cached sequence

**Solution:**
1. Wait 5 seconds
2. Retry transaction
3. Refresh page if persists

### Error: "Wallet locked"

**Cause:** Freighter wallet is locked

**Solution:**
1. Open Freighter extension
2. Enter password to unlock
3. Retry connection in app

### Error: "Invalid contract ID"

**Cause:** Contract not deployed or wrong ID

**Solution:**
1. Verify contract deployed
2. Check .env file has correct IDs
3. Redeploy contracts if needed

---

## 📊 Performance Issues

### Issue: Slow Loading

**Solutions:**
1. Check network speed
2. Clear browser cache
3. Disable browser extensions
4. Use production build

### Issue: High Memory Usage

**Solutions:**
1. Close other tabs
2. Restart browser
3. Check for memory leaks in console

---

## 🔍 Debugging Tips

### Enable Debug Mode

```javascript
// In browser console:
localStorage.setItem('debug', 'true')
```

### View Application State

```javascript
// Check wallet state
console.log(localStorage.getItem('stellargoal_wallet_address'))

// Check goals
console.log(JSON.parse(localStorage.getItem('stellargoal_goals')))

// Check badges
console.log(JSON.parse(localStorage.getItem('stellargoal_badges_<address>')))
```

### Clear All Data

```javascript
// WARNING: Deletes all local data
localStorage.clear()
location.reload()
```

---

## 📞 Still Need Help?

If you're still experiencing issues:

1. **Check Documentation**
   - [README.md](README.md)
   - [DEPLOYMENT.md](DEPLOYMENT.md)
   - [ARCHITECTURE.md](ARCHITECTURE.md)

2. **Search Issues**
   - [GitHub Issues](https://github.com/yourusername/stellargoal/issues)
   - Check if issue already reported

3. **Create New Issue**
   - Use issue template
   - Include error messages
   - Describe steps to reproduce

4. **Contact Support**
   - Email: support@stellargoal.example
   - Discord: [Join Community]
   - Twitter: @stellargoal

---

## ✅ Prevention Checklist

Before starting development:

- [ ] Node.js 18+ installed
- [ ] Rust installed with wasm32 target
- [ ] Freighter wallet installed
- [ ] Testnet account funded
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Tests passing

---

**Most issues can be resolved by:**
1. Refreshing the page
2. Reconnecting wallet
3. Clearing cache/localStorage
4. Checking environment variables
5. Verifying network (Testnet)

---

[← Back to README](README.md) | [Quick Start →](QUICKSTART.md)
