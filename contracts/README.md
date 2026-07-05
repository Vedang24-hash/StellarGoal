# StellarGoal Smart Contracts

Soroban smart contracts for the StellarGoal dApp.

## 📦 Contracts

### 1. GoalManagerContract
Manages savings goals and deposits.

**Functions:**
- `create_goal()` - Create new savings goal
- `deposit_to_goal()` - Deposit XLM to goal
- `complete_goal()` - Mark goal as completed
- `get_goal()` - Retrieve single goal
- `get_goals_by_owner()` - Get all goals for owner
- `get_deposit_history()` - Get deposit records

**Events:**
- `GoalCreatedEvent`
- `DepositMadeEvent`
- `GoalCompletedEvent`

### 2. RewardBadgeContract
Issues achievement badges to users.

**Functions:**
- `issue_badge()` - Issue achievement badge
- `get_badges()` - Get all badges for owner
- `get_badge()` - Get single badge
- `get_badge_count()` - Count badges for owner

**Events:**
- `BadgeIssuedEvent`

## 🔧 Building

```bash
# Build GoalManager
cd goal_manager_contract
cargo build --target wasm32-unknown-unknown --release

# Build RewardBadge
cd reward_badge_contract
cargo build --target wasm32-unknown-unknown --release
```

## 🧪 Testing

```bash
# Test GoalManager
cd goal_manager_contract
cargo test

# Test RewardBadge
cd reward_badge_contract
cargo test
```

## 🚀 Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for deployment instructions.

## 📐 Architecture

```
GoalManagerContract
        │
        │ Inter-contract call
        │ on goal completion
        ▼
RewardBadgeContract
```

When a goal is completed, GoalManager automatically calls RewardBadge to issue an achievement badge.

## 🔐 Security

- ✅ Owner authentication required
- ✅ Input validation
- ✅ Status checks
- ✅ Duplicate badge prevention
- ✅ Overflow protection

## 📚 Resources

- [Soroban Documentation](https://soroban.stellar.org)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Stellar SDK](https://stellar.github.io/js-stellar-sdk/)
