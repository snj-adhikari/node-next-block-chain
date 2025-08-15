# Claude Agent Configuration - Node-Next Blockchain Project

## Project Overview
Full-stack blockchain generator with Next.js frontend and API routes. Currently features blockchain creation, mining, export functionality, and user authentication. The project follows a multi-agent development approach with defined roles and workflows.

## Current Status
- **Branch**: `feature/fix-blockchain-api`
- **Production URL**: https://blockchain-generator-9w38cqrwv.vercel.app
- **Repository**: https://github.com/snj-adhikari/node-next-block-chain
- **Status**: All critical API issues resolved, tests passing, production ready

## Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes, Node.js
- **Testing**: Jest, Testing Library, Cypress E2E
- **Deployment**: Vercel
- **State Management**: Zustand, React Query
- **Authentication**: NextAuth.js

## Development Commands
```bash
# Development
npm run dev

# Build & Deploy
npm run build
npm run start

# Testing
npm run test
npm run test:watch

# Code Quality
npm run lint
npm run lint:fix
npm run type-check

# Vercel Deployment
npm run vercel-build
```

## Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API Routes (blockchain, stats, health)
│   ├── auth/           # Authentication pages
│   ├── create/         # Blockchain creation page
│   └── gallery/        # Blockchain gallery
├── components/         # React Components
│   ├── blockchain/     # Blockchain-specific components
│   ├── common/         # Shared components
│   ├── providers/      # Context providers
│   └── ui/            # UI components (Button, Card, Modal)
├── hooks/             # Custom React hooks
├── styles/            # SCSS stylesheets
└── utils/             # Utility functions

backend/               # Standalone backend (if needed)
├── src/
│   ├── models/        # Data models (Block, Blockchain, User)
│   └── services/      # Business logic services
└── tests/            # Backend unit tests
```

## Key Features
1. **Blockchain Creation**: Custom blockchain generation with configurable parameters
2. **Block Mining**: Proof-of-work mining simulation
3. **Export System**: Export blockchains in various formats
4. **User Authentication**: Secure login/signup system
5. **Gallery View**: Browse and explore created blockchains
6. **API Health Monitoring**: Health check endpoints

## Development Workflow
1. Create feature branches from `develop`
2. Implement changes following established patterns
3. Run tests: `npm run test`
4. Check types: `npm run type-check`
5. Lint code: `npm run lint:fix`
6. Create PR to `develop` branch
7. After review, merge to `develop`
8. Deploy to staging for testing
9. PR from `develop` to `main` (requires owner approval)

## Multi-Agent Team Structure
- **Gemro** (Project Manager): Sprint planning, requirements, coordination
- **Gyro** (QA Engineer): Testing strategy, quality assurance, bug detection
- **Clark** (Full-Stack Developer): Feature implementation, bug fixes
- **Liam** (Tech Lead): Code reviews, architecture, technical guidance

## Agent Responsibilities When Working on This Project
1. **Follow the established workflow**: Always work on feature branches
2. **Maintain code quality**: Run linting and type checking before commits
3. **Test thoroughly**: Ensure all tests pass and write tests for new features
4. **Document changes**: Update relevant documentation files
5. **Coordinate with team**: Consider multi-agent workflow when making changes
6. **Focus on blockchain functionality**: Understand the core blockchain logic
7. **Maintain API stability**: Be careful with API route changes

## Common Tasks
- **Adding new blockchain features**: Extend `BlockchainService.ts` and related models
- **UI improvements**: Work within the established component structure
- **API enhancements**: Follow existing API route patterns
- **Testing**: Add both unit tests (Jest) and E2E tests (Cypress)
- **Performance optimization**: Monitor build size and runtime performance

## Important Files to Reference
- `agent-info.md`: Multi-agent team structure and roles
- `workflow.md`: Git workflow and branch strategy
- `SPRINT_PLAN.md`: Current sprint goals and progress
- `STATUS.md`: Overall project status
- `TECHNICAL.md`: Technical architecture details

## Notes for Agent Collaboration
- Status shows "All tests are passing. API is stable and ready for deployment"
- Sprint plan indicates all critical P0 issues have been resolved
- Project is production-ready with comprehensive testing pipeline
- Follow the established multi-agent coordination protocols
- Maintain the high code quality standards established by the team