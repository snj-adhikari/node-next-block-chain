# � Blockchain Generator

> Create, customize, and deploy your own blockchain networks with ease!

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.0+-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7+-purple.svg)](https://socket.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ What is Blockchain Generator?

Blockchain Generator is a comprehensive, user-friendly platform that allows anyone to create custom blockchain networks without deep technical knowledge. Whether you're a developer learning blockchain technology, an educator teaching crypto concepts, or an entrepreneur prototyping a new digital currency, our tool makes blockchain creation accessible and intuitive.

### 🎯 Perfect For:
- **Educators**: Teaching blockchain and cryptocurrency concepts
- **Developers**: Rapid prototyping and learning blockchain architecture  
- **Entrepreneurs**: Creating proof-of-concept digital currencies
- **Students**: Hands-on blockchain experimentation
- **Researchers**: Testing blockchain parameters and behaviors

## 🚀 Features

### Core Features
- **🔗 Blockchain Creation**: Create custom blockchains from scratch with configurable parameters
- **⛏️ Real-time Mining**: Live mining progress with WebSocket updates
- **📊 Interactive Dashboard**: User-friendly interface for blockchain management
- **🔐 Social Authentication**: Login with Google/Facebook using NextAuth.js
- **📱 Responsive Design**: Beautiful, mobile-first UI with Tailwind CSS
- **🚀 Real-time Notifications**: Socket.IO powered live updates

### Technical Features
- **🛡️ Security**: Rate limiting, input validation, CORS protection
- **💾 JSON Storage**: File-based storage system (Vercel compatible)
- **🧪 Comprehensive Testing**: Unit and integration tests
- **📝 TypeScript**: Full type safety across frontend and backend
- **🔧 ESLint**: Code quality and consistency
- **🚀 CI/CD**: GitHub Actions for automated testing and deployment

## 🏗️ Architecture

```
blockchain-generator/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── models/    # Block, Blockchain, User models
│   │   ├── services/  # Business logic services
│   │   ├── routes/    # API endpoints
│   │   └── app.ts     # Express app setup
│   └── tests/         # Backend tests
├── frontend/          # Next.js React app
│   ├── src/
│   │   ├── components/# Reusable React components
│   │   ├── pages/     # Next.js pages
│   │   ├── utils/     # Utility functions
│   │   └── types/     # TypeScript types
│   └── __tests__/     # Frontend tests
└── .github/           # GitHub Actions workflows
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Socket.IO** - Real-time communication
- **JSON** - File-based storage
- **Jest** - Testing framework
- **ESLint** - Code linting

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Query** - State management
- **NextAuth.js** - Authentication
- **Socket.IO Client** - Real-time updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 8+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/snj-adhikari/node-next-block-chain.git
   cd node-next-block-chain
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   **Backend** (`.env` in `backend/` folder):
   ```env
   NODE_ENV=development
   PORT=8000
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGIN=http://localhost:3000
   ```

   **Frontend** (`.env.local` in `frontend/` folder):
   ```env
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:8000
   
   # OAuth Providers
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FACEBOOK_CLIENT_ID=your-facebook-client-id
   FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API on http://localhost:8000
   - Frontend on http://localhost:3000

## 🧪 Testing

### Run all tests
```bash
npm run test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific tests
```bash
# Backend only
npm run test:backend

# Frontend only
npm run test:frontend
```

## 🔍 Linting & Code Quality

### Lint all code
```bash
npm run lint
```

### Fix linting issues
```bash
npm run lint:fix
```

### Type checking
```bash
npm run type-check
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - Social login
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Blockchain Endpoints
- `POST /api/blockchain` - Create new blockchain
- `GET /api/blockchain/:id` - Get blockchain details
- `GET /api/blockchain/:id/blocks` - Get all blocks
- `POST /api/blockchain/:id/mine` - Mine new block
- `POST /api/blockchain/:id/publish` - Publish blockchain
- `GET /api/user/:userId/blockchains` - Get user blockchains

### WebSocket Events
- `mining-progress` - Real-time mining updates
- `blockchain-created` - New blockchain notifications
- `block-mined` - Block mining completion

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Deploy Frontend**
   ```bash
   cd frontend
   vercel
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   vercel
   ```

3. **Environment Variables**
   Set the environment variables in Vercel dashboard.

### Manual Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Start production servers**
   ```bash
   # Backend
   cd backend && npm start

   # Frontend
   cd frontend && npm start
   ```

## 🔧 Development Workflow

### Branch Management
- `main` - Production ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical fixes

### Creating Features
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push branch (auto-creates PR via GitHub Actions)
git push origin feature/new-feature
```

### CI/CD Pipeline
GitHub Actions automatically:
- Runs tests on all PRs
- Performs security scanning
- Checks code quality with ESLint
- Builds both frontend and backend
- Deploys to Vercel on merge to main

## 📱 Usage Examples

### Creating a Blockchain
```javascript
const blockchain = {
  name: "My Crypto",
  symbol: "MYC",
  difficulty: 4,
  reward: 100,
  description: "My custom cryptocurrency"
};

const response = await fetch('/api/blockchain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(blockchain)
});
```

### Mining Blocks
```javascript
// Real-time mining with progress updates
const socket = io('http://localhost:8000');

socket.on('mining-progress', (data) => {
  console.log(`Mining progress: ${data.progress}%`);
});

await fetch(`/api/blockchain/${blockchainId}/mine`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ transactions: [...] })
});
```

## 🔐 Security Features

- **Rate Limiting**: API endpoint protection
- **Input Validation**: All user inputs validated
- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet.js**: Security headers
- **JWT Authentication**: Secure token-based auth
- **Hash Validation**: Blockchain integrity verification

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines
- Use TypeScript for type safety
- Follow ESLint rules
- Write tests for new features
- Use conventional commit messages
- Update documentation

## 📞 Support

- **GitHub Issues**: [Report bugs](https://github.com/snj-adhikari/node-next-block-chain/issues)
- **Discussions**: [Ask questions](https://github.com/snj-adhikari/node-next-block-chain/discussions)
- **Email**: Contact maintainer

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Express.js](https://expressjs.com/) - Web framework
- [Socket.IO](https://socket.io/) - Real-time communication
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

**Happy Blockchain Building! 🚀**
