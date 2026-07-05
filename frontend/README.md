# StellarGoal Frontend

React + Vite frontend for the StellarGoal decentralized savings tracker.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📦 Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests with Vitest

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_STELLAR_NETWORK=TESTNET
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_GOAL_MANAGER_CONTRACT_ID=<contract_id>
VITE_REWARD_BADGE_CONTRACT_ID=<contract_id>
```

## 📁 Structure

```
src/
├── components/     # React components
│   ├── WalletCard.jsx
│   ├── GoalCard.jsx
│   └── ...
├── hooks/          # Custom React hooks
│   └── useWallet.js
├── utils/          # Utility functions
│   ├── stellar.js
│   └── contractHelpers.js
├── App.jsx         # Main app component
├── App.css         # Global styles
└── main.jsx        # Entry point
```

## 🧪 Testing

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # With coverage
```

## 🎨 Styling

- **Single CSS file:** `App.css`
- **No UI libraries** (no Tailwind, Bootstrap, etc.)
- **Responsive design** with CSS Grid & Flexbox
- **CSS variables** for theming

## 🔗 Dependencies

- **react** - UI library
- **react-dom** - React DOM renderer
- **@stellar/freighter-api** - Wallet integration
- **@stellar/stellar-sdk** - Stellar SDK
- **vite** - Build tool
- **vitest** - Testing framework

## 📚 Documentation

See [main README](../README.md) for full documentation.
