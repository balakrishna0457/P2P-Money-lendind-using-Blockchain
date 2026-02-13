# Contributing to P2P Lending Platform

Thank you for your interest in contributing to the P2P Lending Platform! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

### Suggesting Features

Feature suggestions are welcome! Please:
- Check existing issues first
- Provide clear use case
- Explain expected behavior
- Consider implementation complexity

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/p2p-lend.git
   cd p2p-lend
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Your Changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation
   - Ensure all tests pass

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # or
   git commit -m "fix: resolve bug in payment service"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## 📝 Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add multi-chain support
fix: resolve MetaMask connection issue
docs: update API documentation
test: add unit tests for credit service
```

## 🎨 Code Style

### JavaScript/React
- Use ES6+ features
- Use functional components with hooks
- Follow Airbnb style guide
- Use meaningful variable names
- Add comments for complex logic

### Solidity
- Follow Solidity style guide
- Use NatSpec comments
- Implement security best practices
- Add comprehensive tests

### General
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Keep lines under 100 characters

## 🧪 Testing Requirements

### Before Submitting PR
- [ ] All existing tests pass
- [ ] New tests added for new features
- [ ] Manual testing completed
- [ ] No console errors
- [ ] Code linted and formatted

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd p2p-lend/p2p-lend
npm test

# Smart contract tests
cd backend
npx hardhat test
```

## 📚 Documentation

Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying configuration
- Updating dependencies

Files to update:
- `README.md` - Main documentation
- `API_DOCUMENTATION.md` - API changes
- `SETUP_GUIDE.md` - Setup changes
- Code comments - Complex logic

## 🔒 Security

### Reporting Security Issues
**DO NOT** create public issues for security vulnerabilities.

Instead:
1. Email security concerns privately
2. Provide detailed description
3. Include steps to reproduce
4. Wait for response before disclosure

### Security Best Practices
- Never commit sensitive data (.env files)
- Use environment variables
- Validate all inputs
- Sanitize user data
- Follow OWASP guidelines
- Keep dependencies updated

## 🌿 Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

## 📋 PR Checklist

Before submitting, ensure:
- [ ] Code follows style guidelines
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Commits are clean and meaningful
- [ ] PR description is clear
- [ ] Related issues linked

## 🎯 Development Setup

1. **Install Dependencies**
   ```bash
   cd backend && npm install
   cd ../p2p-lend/p2p-lend && npm install
   ```

2. **Setup Environment**
   - Copy `.env.example` to `.env`
   - Fill in required values

3. **Start Development**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd p2p-lend/p2p-lend
   npm start
   ```

## 🐛 Debugging Tips

### Backend Issues
- Check MongoDB connection
- Verify environment variables
- Review server logs
- Test API with Postman

### Frontend Issues
- Check browser console
- Verify API endpoints
- Check MetaMask connection
- Review React DevTools

### Smart Contract Issues
- Check Hardhat console
- Verify contract deployment
- Review transaction logs
- Test with Remix IDE

## 📞 Getting Help

- Check existing documentation
- Search closed issues
- Ask in discussions
- Join community chat

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to P2P Lending Platform! 🚀
