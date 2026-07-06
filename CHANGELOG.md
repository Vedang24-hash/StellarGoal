# Changelog

All notable changes to the StellarGoal project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

