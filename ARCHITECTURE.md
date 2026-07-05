# 🏗️ StellarGoal Architecture

This document provides a comprehensive overview of the StellarGoal architecture, design decisions, and technical implementation details.

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              React + Vite Application                │   │
│  │                                                       │   │
│  │  Components:                                         │   │
│  │  • WalletCard    • GoalCard    • BadgeSection      │   │
│  │  • BalanceCard   • GoalsList   • Analytics         │   │
│  │  • SendXLMForm   • DepositForm • HeroSection       │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Hooks Layer                         │   │
│  │  • useWallet (Freighter integration)                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 Utility Layer                        │   │
│  │  • stellar.js (Horizon API, XLM operations)         │   │
│  │  • contractHelpers.js (Contract interactions)       │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼───────┐      ┌───────▼───────┐
        │  Freighter    │      │  Stellar      │
        │  Wallet API   │      │  Horizon API  │
        └───────┬───────┘      └───────────────┘
                │
                │ Sign Transactions
                │
┌───────────────▼─────────────────────────────────────────────┐
│                    Stellar Network                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Soroban Smart Contracts                 │   │
│  │                                                       │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐│   │
│  │  │ GoalManagerContract  │  │ RewardBadgeContract  ││   │
│  │  │                      │  │                      ││   │
│  │  │ • create_goal()      │  │ • issue_badge()      ││   │
│  │  │ • deposit_to_goal()  │◄─┤ • get_badges()       ││   │
│  │  │ • complete_goal()    │  │ • get_badge()        ││   │
│  │  │ • get_goal()         │  │                      ││   │
│  │  │ • get_goals()        │  │                      ││   │
│  │  │ • get_deposits()     │  │                      ││   │
│  │  └──────────────────────┘  └──────────────────────┘│   │
│  │                                                       │   │
│  │         Inter-contract Communication                 │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Component Architecture

### Frontend Components Hierarchy

```
App
├── HeroSection
├── WalletCard
│   └── useWallet hook
├── BalanceCard
├── SendXLMForm
├── AnalyticsDashboard
├── CreateGoalForm
├── GoalsList
│   └── GoalCard[]
│       ├── DepositForm
│       └── DepositHistory
└── BadgeSection
```

---

## 🎣 Hooks Architecture

### useWallet Hook

**Purpose:** Manage Freighter wallet connection, session persistence, and demo mode

**State:**
- `address`: Connected wallet address
- `network`: Network type (TESTNET/MAINNET)
- `networkOk`: Network validation status
- `installed`: Freighter detection status
- `connecting`: Connection in progress
- `error`: Error message

**Key Features:**
1. **Auto-detection:** Retries Freighter detection with exponential backoff
2. **Session Restore:** Automatically reconnects on page reload
3. **Demo Mode:** Simulated wallet for testing
4. **Network Validation:** Ensures correct network (Testnet/Mainnet)

**Flow:**
```
Mount → detectFreighter() → restoreSession()
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
            Connected Previously?              Not Connected
                    │                                │
            Auto-restore address           Show connect buttons
```

---

## 🔐 Smart Contract Architecture

### GoalManagerContract

**Storage Structure:**
```rust
DataKey::Goal(String)              → Goal struct
DataKey::GoalsByOwner(Address)     → Vec<String> (Goal IDs)
DataKey::Deposits(String)          → Vec<Deposit>
DataKey::GoalCounter               → u64
DataKey::RewardContract            → Address
```

**Events Emitted:**
- `GoalCreatedEvent`: When new goal created
- `DepositMadeEvent`: When deposit made to goal
- `GoalCompletedEvent`: When goal completed

**Security:**
- Owner authentication required for all operations
- Input validation on all functions
- Status checks prevent invalid state transitions

### RewardBadgeContract

**Storage Structure:**
```rust
DataKey::Badge(String)              → Badge struct
DataKey::BadgesByOwner(Address)     → Vec<String> (Badge IDs)
DataKey::BadgeCounter               → u64
DataKey::GoalManagerContract        → Address
```

**Events Emitted:**
- `BadgeIssuedEvent`: When badge awarded

**Security:**
- Duplicate badge prevention
- Authorization checks
- Inter-contract call validation

### Inter-Contract Communication

When a goal is completed:
```
User → complete_goal() → GoalManagerContract
                              │
                              │ Update goal status
                              │
                              ▼
                        issue_badge() → RewardBadgeContract
                                              │
                                              │ Create badge
                                              │
                                              ▼
                                        Emit BadgeIssuedEvent
```

---

## 💾 Data Flow

### Create Goal Flow

```
1. User fills CreateGoalForm
         ↓
2. Form validation
         ↓
3. create_goal() called (localStorage simulation)
         ↓
4. Goal stored with unique ID
         ↓
5. Added to owner's goal list
         ↓
6. Check if first goal → Issue "First Goal" badge
         ↓
7. GoalCreatedEvent emitted
         ↓
8. UI refreshes with new goal
```

### Deposit Flow

```
1. User enters deposit amount
         ↓
2. Amount validation
         ↓
3. deposit_to_goal() called
         ↓
4. Goal balance updated
         ↓
5. Deposit record created
         ↓
6. Check for milestone badges
         ↓
7. DepositMadeEvent emitted
         ↓
8. UI shows updated progress
```

### Complete Goal Flow

```
1. User clicks "Complete Goal"
         ↓
2. Verify target reached
         ↓
3. complete_goal() called
         ↓
4. Goal status → Completed
         ↓
5. Inter-contract call to issue badge
         ↓
6. "Goal Completer" badge issued
         ↓
7. GoalCompletedEvent emitted
         ↓
8. UI shows completion + badge
```

---

## 🎨 State Management

### Local State (Component Level)
- Form inputs
- UI toggles (show/hide)
- Loading states
- Error messages

### Session State (LocalStorage)
- Wallet connection info
- Goals data (simulating contract storage)
- Deposits history
- Badges earned

### Props Flow
```
App (global state)
  ├── wallet state → WalletCard, BalanceCard
  ├── ownerAddress → GoalsList, CreateGoalForm
  └── refreshTrigger → GoalsList (force refresh)
```

---

## 🔄 Real-time Updates

### Balance Auto-refresh
- Polls Horizon API every 15 seconds
- Updates on transaction completion
- Manual refresh button available

### Goals Refresh
- Triggered by goal creation
- Triggered by deposit
- Triggered by completion
- Uses `refreshTrigger` state increment

### Analytics Updates
- Recalculates every 5 seconds
- Based on localStorage data
- Shows live metrics

---

## 🧪 Testing Strategy

### Frontend Tests (Vitest + React Testing Library)

**Component Tests:**
- WalletCard: Connection states, button actions
- GoalCard: Rendering, progress, actions
- CreateGoalForm: Validation, submission

**Integration Tests:**
- Wallet connection flow
- Goal creation → display → deposit → complete
- Badge issuance on milestones

### Contract Tests (Rust)

**Unit Tests:**
- Goal creation validation
- Deposit logic
- Completion conditions
- Badge issuance
- Duplicate prevention

**Test Coverage Goals:**
- Frontend: >80%
- Contracts: >90%

---

## 🚀 Performance Optimizations

### Frontend
1. **Code Splitting:** Vite automatic code splitting
2. **Lazy Loading:** Components loaded on demand
3. **Memoization:** React.memo for expensive components
4. **Debouncing:** Input validation debounced
5. **Asset Optimization:** CSS minification, tree-shaking

### Smart Contracts
1. **Storage Optimization:** Efficient data structures
2. **Gas Optimization:** Minimal storage operations
3. **Batch Operations:** Process multiple items efficiently
4. **Event Indexing:** Events for off-chain indexing

---

## 🔒 Security Considerations

### Frontend Security
- ✅ No private keys stored
- ✅ Input sanitization
- ✅ XSS prevention
- ✅ HTTPS only
- ✅ Environment variable protection

### Contract Security
- ✅ Authentication on all state changes
- ✅ Input validation
- ✅ Reentrancy protection (Soroban native)
- ✅ Integer overflow protection
- ✅ Access control

---

## 📦 Deployment Architecture

### Production Environment

```
GitHub Repository
       │
       │ Push/PR
       ▼
GitHub Actions CI/CD
       │
       ├─► Frontend Tests
       ├─► Contract Tests
       └─► Linting
       │
       │ Success
       ▼
   Build Artifacts
       │
       ├─► WASM files (contracts)
       └─► Dist folder (frontend)
       │
       ▼
┌──────┴──────┐
│             │
▼             ▼
Stellar     Vercel
Testnet    (Frontend)
```

---

## 🔮 Future Enhancements

### Planned Features
1. **Real Soroban Integration:** Replace localStorage with actual contract calls
2. **Withdraw Function:** Allow withdrawing from goals
3. **Goal Sharing:** Share goals with friends
4. **Recurring Deposits:** Automated savings
5. **Multi-currency Support:** Support other Stellar assets
6. **Mobile App:** React Native version
7. **Social Features:** Leaderboards, challenges
8. **NFT Badges:** Mint badges as NFTs

### Scalability Considerations
- Implement pagination for goals
- Add indexing service for faster queries
- Use Stellar events for real-time updates
- Implement caching layer

---

## 📚 Technology Decisions

### Why React?
- Component-based architecture
- Large ecosystem
- Excellent developer experience
- Strong community support

### Why Vite?
- Fast development server
- Instant HMR
- Optimized builds
- ESM native

### Why Rust/Soroban?
- Type safety
- Performance
- Stellar native smart contracts
- Growing ecosystem

### Why Plain CSS?
- Full control over styling
- No learning curve for contributors
- Smaller bundle size
- Better for understanding fundamentals

---

## 🤔 Design Patterns Used

1. **Custom Hooks:** `useWallet` for reusable wallet logic
2. **Component Composition:** Small, focused components
3. **Prop Drilling Alternative:** Callback props for state updates
4. **Separation of Concerns:** Utils for business logic
5. **Event-Driven:** Contract events for state changes
6. **Factory Pattern:** Goal and badge creation
7. **Observer Pattern:** Auto-refresh mechanisms

---

**Questions about the architecture?** Open a GitHub Discussion!
