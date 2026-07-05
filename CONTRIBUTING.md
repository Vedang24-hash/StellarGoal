# Contributing to StellarGoal

Thank you for your interest in contributing to StellarGoal! This document provides guidelines for contributing to the project.

## 🤝 Code of Conduct

Please be respectful and constructive in all interactions. We aim to foster an inclusive and welcoming community.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/stellargoal.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes thoroughly
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## 📝 Commit Message Guidelines

Use clear, descriptive commit messages following this format:

```
type(scope): brief description

Detailed explanation (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
- `feat(wallet): add multi-wallet support`
- `fix(goals): resolve progress calculation bug`
- `docs(readme): update deployment instructions`

## 🧪 Testing Requirements

- All new features must include tests
- Ensure all existing tests pass: `npm test` and `cargo test`
- Test coverage should not decrease

## 📋 Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure CI/CD pipeline passes
4. Request review from maintainers
5. Address review feedback
6. Squash commits if requested

## 🎨 Code Style

### Frontend (JavaScript/React)
- Use functional components with hooks
- Follow existing component structure
- Add PropTypes or TypeScript types
- Keep components small and focused
- Use meaningful variable names

### Smart Contracts (Rust)
- Follow Rust naming conventions
- Add comprehensive documentation comments
- Use `cargo fmt` for formatting
- Run `cargo clippy` for linting
- Add unit tests for all functions

### CSS
- Use BEM naming convention
- Keep styles modular
- Use CSS variables for theming
- Ensure mobile responsiveness

## 🐛 Reporting Bugs

Use GitHub Issues with the following information:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, browser, versions
- **Screenshots**: If applicable

## 💡 Suggesting Features

Feature requests are welcome! Please include:

- **Use Case**: Why is this feature needed?
- **Proposed Solution**: How should it work?
- **Alternatives**: Other approaches considered
- **Implementation Ideas**: Technical details (optional)

## 🔍 Review Process

- Maintainers review PRs within 3-5 business days
- Address feedback promptly
- Be open to suggestions and improvements
- Maintain respectful communication

## 📚 Documentation

- Update README.md for user-facing changes
- Update DEPLOYMENT.md for deployment changes
- Add JSDoc/Rustdoc comments for new functions
- Include examples where helpful

## 🎯 Priority Areas

We especially welcome contributions in:

- UI/UX improvements
- Additional goal categories
- More achievement badges
- Performance optimizations
- Accessibility enhancements
- Internationalization (i18n)
- Contract gas optimization

## ❓ Questions?

- Open a GitHub Discussion
- Join our Discord community
- Email: dev@stellargoal.example

Thank you for contributing to StellarGoal! 🌟
