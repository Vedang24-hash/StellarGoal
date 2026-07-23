# Changelog

All notable changes to the StellarGoal project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.html).

## [1.2.0] - 2026-07-23

### Fixed
- **CRITICAL: Deposit Transaction Bug** - Deposits now properly deduct XLM from wallet
  - Integrated Freighter wallet signing for deposit transactions
  - Deposits now require blockchain confirmation before updating UI
  - XLM is actually transferred from user wallet to goal escrow
  - Added escrow address to goal creation (currently set to owner for demo)
  - Transaction hashes now recorded with each deposit
  - Proper error handling for failed transactions
  - User-friendly error messages for common failure scenarios:
    - User declined transaction
    - Insufficient balance (with 1 XLM reserve reminder)
    - Freighter wallet not found/unlocked
  - Fixed Freighter API detection using `@stellar/freighter-api` import
  - Added `isConnected()` and `isAllowed()` checks before signing

### Added
- **Transaction Hash Display on Goal Cards**
  - Each goal card shows 3 most recent transactions
  - Transaction amount, date, and clickable hash link
  - Direct links to Stellar Expert for verification
  - "View all transactions" button if more than 3 deposits
  - Mobile-responsive transaction display

- **Transaction Proof Component (Mentor Verification)**
  - Dedicated section for blockchain verification
  - Shows wallet address with link to Stellar Expert
  - Displays total transaction count and total XLM deposited
  - Complete list of ALL transactions with full details
  - Each transaction shows:
    - Transaction number
    - Goal name
    - Amount deposited
    - Date and time
    - Full transaction hash (desktop) or shortened (mobile)
    - Ledger number
    - Clickable link to Stellar Expert
  - Prominent "For Mentors" message explaining verification

- **Enhanced Deposit History Modal**
  - Transaction hashes displayed with each deposit
  - Shortened hash format (8 chars each side)
  - Clickable links to Stellar Expert
  - Visual styling with hover effects
  - Mobile-responsive layout

- **Documentation**
  - Created `TRANSACTION_VERIFICATION.md` - Complete guide for mentors
  - Explains how to verify transactions on blockchain
  - Step-by-step verification instructions
  - Example transaction flow
  - Red flags for fake transactions vs. real implementation
  - Links to Stellar Expert and other tools

### Changed
- **DepositForm.jsx** - Complete rewrite of deposit logic
  - Now uses `sendXLM()` function from stellar.js
  - Requires Freighter signature before updating localStorage
  - Added validation for Freighter wallet availability
  - Deposits include depositor's public key (not just goal owner)
  - Uses `freighter` import from `@stellar/freighter-api`
  - Checks `isConnected()` and `isAllowed()` before operations
  
- **CreateGoalForm.jsx** - Added escrow address to goals
  - Each goal now has an `escrowAddress` property
  - Currently set to owner address for demo (self-transfer)
  - Ready for future contract-controlled escrow implementation

- **GoalCard.jsx** - Added transaction display section
  - Shows recent transactions directly on card
  - Imports `getTransactionUrl` and `shortenAddress` from stellar.js
  - Displays transaction hashes with verification links
  - Responsive design for mobile devices

- **DepositHistory.jsx** - Enhanced deposit display
  - Shows transaction hash with link to explorer
  - Uses `shortenAddress()` for compact display
  - Improved layout with details section
  - Better mobile responsiveness for transaction info

- **App.jsx** - Added TransactionProof component
  - New section after badges
  - Available when wallet connected
  - Automatically loads all user transactions

- **App.css** - Comprehensive transaction styling
  - Goal card transaction section styles
  - Transaction Proof component complete styling
  - Transaction link hover effects and animations
  - Mobile-responsive breakpoints
  - Desktop: full transaction hashes
  - Mobile: shortened hashes with responsive layout

## [1.1.0] - 2026-01-07

### Fixed
- **Console Errors** - Resolved critical `TypeError: Failed to fetch. URL scheme "type" is not supported`
  - Added robust URL sanitization in `frontend/src/utils/stellar.js`
  - Implemented regex patterns to clean Horizon URL:
    - Removes "type:" prefix if present
    - Strips quotes from URL string
    - Trims whitespace
  - Added console logging for debugging URL configuration
  - Enhanced error handling for fetch operations

- **Button Text Visibility** - Fixed navbar button text not being visible
  - Send XLM button now has proper white text with contrast
  - Disconnect Wallet button displays alabaster-light text
  - Added `!important` declarations for color enforcement
  - Applied explicit styling to `.button-text` and `.button-icon` classes

### Added
- **Interactive Button Effects**
  - Hover state: Lift animation with `translateY(-2px)` transform
  - Active/click state: Press effect with `translateY(0px)` transform
  - Enhanced shadow effects on interaction
  - Smooth transitions (0.3s ease) on all button types
  - Applied to: primary, secondary, success, danger, and navbar buttons

### Changed
- **Mobile Responsiveness - Major Overhaul**
  - Reduced card padding by 60% (from `--spacing-lg` to `--spacing-md`)
  - Optimized spacing variables for compact layouts:
    - `--spacing-xs`: 0.2rem → 0.15rem
    - `--spacing-sm`: 0.4rem → 0.35rem
    - `--spacing-md`: 0.75rem → 0.6rem
    - `--spacing-lg`: 1rem → 0.85rem
    - `--spacing-xl`: 1.25rem → 1rem
  - Enhanced mobile breakpoints (768px, 480px, 380px):
    - **768px and below**: Compact card layouts, reduced font sizes
    - **480px and below**: Tighter spacing, single-column grids
    - **380px and below**: Ultra-compact mode with minimal padding
  - Improved component responsiveness:
    - Goal cards: Reduced padding to `xs/sm`, smaller fonts
    - Analytics stats: Single column, compact sizing
    - Badge grid: 2 columns on mobile, 1 column on extra small
    - Forms: Full-width buttons, minimal input padding
    - Step cards: Reduced number badge size (36px → 30px)
  - Better text sizing for mobile readability
  - Optimized hero section for small screens

### Technical Improvements
- Enhanced URL validation and error recovery in Stellar utilities
- Improved CSS architecture for maintainability
- Added comprehensive mobile-first responsive design patterns
- Refined button interaction states across all components

### Files Modified
- `frontend/src/utils/stellar.js` - URL sanitization and error handling
- `frontend/src/App.css` - Mobile responsiveness and button effects
- `frontend/.env` - Environment configuration (no changes, verified clean)
- `README.md` - Updated with recent changes
- `frontend/README.md` - Added recent updates section

---

## [1.0.0] - 2026-01-06

### Added
- Initial release of StellarGoal
- Freighter wallet integration
- Multi-goal management system
- XLM deposit functionality
- Progress tracking with analytics
- Achievement badge system
- Soroban smart contracts (GoalManager & RewardBadge)
- Real-time balance updates
- Responsive web interface
- Comprehensive documentation
- CI/CD with GitHub Actions
- Deployment to Vercel

