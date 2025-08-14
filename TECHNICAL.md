# 🔧 Technical Documentation

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Blockchain Generator                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (Next.js 14)          Backend (Node.js/Express)  │
│  ┌─────────────────────┐        ┌─────────────────────────┐ │
│  │ • React Components  │◄──────►│ • RESTful API           │ │
│  │ • TypeScript        │        │ • WebSocket Server      │ │
│  │ • Tailwind CSS      │        │ • Blockchain Logic      │ │
│  │ • Framer Motion     │        │ • File Storage          │ │
│  │ • Real-time UI      │        │ • Rate Limiting         │ │
│  └─────────────────────┘        └─────────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                     Data Layer                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ • JSON File Storage                                     │ │
│  │ • Blockchain Data (chains/, users/, stats/)           │ │
│  │ • Newsletter Subscriptions                             │ │
│  │ • Example Blockchains                                  │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🏗️ How Blockchain Creation Works

### 1. Blockchain Structure

Our blockchain implementation follows standard blockchain principles:

```typescript
interface Block {
  index: number           // Block position in chain
  timestamp: string       // Block creation time
  data: any              // Transaction data
  previousHash: string   // Hash of previous block
  hash: string          // Current block hash
  nonce: number         // Proof of work nonce
  difficulty: number    // Mining difficulty
  miner?: string        // Miner identifier
}

interface Blockchain {
  id: string             // Unique blockchain identifier
  name: string          // Human-readable name
  symbol: string        // Token symbol (e.g., BTC, ETH)
  description: string   // Purpose description
  difficulty: number    // Mining difficulty (1-6)
  reward: number        // Block reward amount
  maxSupply: number     // Maximum token supply
  blocks: Block[]       // Array of blocks
  createdAt: string     // Creation timestamp
  userId: string        // Creator identifier
  published: boolean    // Public visibility
}
```

### 2. Mining Algorithm

```typescript
class BlockchainService {
  // Creates genesis block with blockchain configuration
  createBlockchain(config: BlockchainConfig, userId: string): Blockchain {
    const genesisBlock = this.createGenesisBlock(config)
    return {
      id: generateUniqueId(),
      ...config,
      blocks: [genesisBlock],
      createdAt: new Date().toISOString(),
      userId,
      published: false
    }
  }

  // Mines new block with Proof of Work
  mineBlock(blockchain: Blockchain, data: any): Block {
    const previousBlock = blockchain.blocks[blockchain.blocks.length - 1]
    const newBlock = {
      index: previousBlock.index + 1,
      timestamp: new Date().toISOString(),
      data,
      previousHash: previousBlock.hash,
      hash: '',
      nonce: 0,
      difficulty: blockchain.difficulty
    }

    // Proof of Work mining
    while (newBlock.hash.substring(0, blockchain.difficulty) !== '0'.repeat(blockchain.difficulty)) {
      newBlock.nonce++
      newBlock.hash = this.calculateHash(newBlock)
    }

    return newBlock
  }

  // SHA-256 hash calculation
  calculateHash(block: Block): string {
    return crypto
      .createHash('sha256')
      .update(block.index + block.timestamp + JSON.stringify(block.data) + block.previousHash + block.nonce)
      .digest('hex')
  }
}
```

### 3. Real-time Mining Progress

WebSocket implementation for live updates:

```typescript
// Backend: Real-time mining notifications
class NotificationService {
  sendMiningProgress(userId: string, progress: {
    blockIndex: number
    currentNonce: number
    hashRate: number
    estimatedTime: number
  }) {
    this.io.to(`user_${userId}`).emit('mining:progress', progress)
  }

  sendBlockFound(userId: string, block: Block) {
    this.io.to(`user_${userId}`).emit('mining:block_found', block)
  }
}

// Frontend: Real-time UI updates
useEffect(() => {
  socket.on('mining:progress', (progress) => {
    setMiningProgress(progress)
  })

  socket.on('mining:block_found', (block) => {
    setBlockchain(prev => ({
      ...prev,
      blocks: [...prev.blocks, block]
    }))
  })
}, [])
```

## 🔌 API Endpoints

### Blockchain Operations

```typescript
// Create new blockchain
POST /api/blockchain/create
{
  "config": {
    "name": "MyCoin",
    "symbol": "MYC", 
    "description": "My custom blockchain",
    "difficulty": 2,
    "reward": 50,
    "maxSupply": 1000000
  },
  "userId": "user-123"
}

// Mine blocks on existing blockchain
POST /api/blockchain/:id/mine
{
  "transactions": [...],
  "userId": "user-123"
}

// Get blockchain details
GET /api/blockchain/:id

// Get user's blockchains  
GET /api/user/:userId/blockchains

// Get published blockchains
GET /api/blockchains/published

// Export blockchain data
GET /api/blockchain/:id/export
```

### Newsletter & User Management

```typescript
// Subscribe to newsletter
POST /api/newsletter
{
  "email": "user@example.com",
  "source": "homepage"
}

// Get newsletter statistics (admin)
GET /api/newsletter?action=stats

// Unsubscribe from newsletter
DELETE /api/newsletter?email=user@example.com
```

### System Statistics

```typescript
// Get platform statistics
GET /api/stats
{
  "totalBlockchains": 156,
  "totalUsers": 89,
  "totalBlocks": 2340,
  "totalPublished": 23,
  "connectedUsers": 5
}
```

## 🎨 Frontend Architecture

### Component Structure

```
frontend/src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Homepage
│   ├── create/page.tsx          # Blockchain creation
│   ├── gallery/page.tsx         # Community gallery
│   ├── auth/signin/page.tsx     # Authentication
│   └── api/                     # API routes
│       └── newsletter/route.ts  # Newsletter endpoint
├── components/                   # Reusable components
│   ├── ui/                      # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   └── blockchain/              # Blockchain-specific
│       ├── BlockchainVisualization.tsx
│       └── MiningProgress.tsx
├── lib/                         # Utilities
│   ├── utils.ts
│   └── blockchain.ts
└── styles/                      # Global styles
    └── globals.css
```

### State Management

```typescript
// Blockchain creation state
interface CreateBlockchainState {
  formData: BlockchainFormData
  isCreating: boolean
  createdBlockchain: Blockchain | null
  errors: Record<string, string>
  notification: NotificationState
}

// Real-time mining state
interface MiningState {
  isActive: boolean
  currentBlock: number
  hashRate: number
  progress: number
  estimatedTime: number
}
```

## 🔒 Security Implementation

### Rate Limiting

```typescript
// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later.'
})

// Mining-specific rate limiting
const miningLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 mining requests per minute
  message: 'Mining rate limit exceeded.'
})
```

### Input Validation

```typescript
// Server-side validation
const validateBlockchainConfig = (config: any): ValidationResult => {
  const errors: string[] = []

  if (!config.name || typeof config.name !== 'string') {
    errors.push('Name is required')
  }

  if (!config.symbol || config.symbol.length > 5) {
    errors.push('Symbol must be 1-5 characters')
  }

  if (config.difficulty < 1 || config.difficulty > 6) {
    errors.push('Difficulty must be between 1 and 6')
  }

  return { valid: errors.length === 0, errors }
}
```

### CORS & Security Headers

```typescript
// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}))

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}))
```

## 📁 File System Organization

### Backend Data Structure

```
backend/data/
├── chains/                    # Blockchain storage
│   ├── blockchain-123.json   # Individual blockchain files
│   └── blockchain-456.json
├── users/                     # User data
│   └── user-sessions.json    # User session data
└── stats/                     # Platform statistics
    └── platform-stats.json  # Global stats
```

### Frontend Build Output

```
frontend/.next/
├── static/                   # Static assets
├── server/                   # Server-side code
└── cache/                    # Build cache
```

### Example Blockchain File Structure

```json
{
  "id": "blockchain-1629123456789",
  "name": "DemoCoin",
  "symbol": "DEMO",
  "description": "A demonstration blockchain",
  "difficulty": 2,
  "reward": 50,
  "maxSupply": 1000000,
  "blocks": [
    {
      "index": 0,
      "timestamp": "2024-08-14T10:30:00.000Z",
      "data": "Genesis Block",
      "previousHash": "0",
      "hash": "000abc123...",
      "nonce": 142,
      "difficulty": 2
    }
  ],
  "createdAt": "2024-08-14T10:30:00.000Z",
  "userId": "anonymous-user-1629123456789",
  "published": false
}
```

## 🚀 Deployment & Scaling

### Docker Configuration

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8001
CMD ["npm", "start"]

# Frontend Dockerfile  
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration

```bash
# Backend .env
NODE_ENV=production
PORT=8001
FRONTEND_URL=https://blockchain-generator.com
CORS_ORIGIN=https://blockchain-generator.com
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Frontend .env.local
NEXT_PUBLIC_API_URL=https://api.blockchain-generator.com
NEXT_PUBLIC_WS_URL=wss://api.blockchain-generator.com
```

## 🧪 Testing Strategy

### Unit Testing (Backend)

```typescript
describe('BlockchainService', () => {
  test('should create valid genesis block', () => {
    const config = { name: 'Test', symbol: 'TST', difficulty: 1 }
    const blockchain = blockchainService.createBlockchain(config, 'user-1')
    
    expect(blockchain.blocks).toHaveLength(1)
    expect(blockchain.blocks[0].index).toBe(0)
    expect(blockchain.blocks[0].previousHash).toBe('0')
  })

  test('should mine block with correct difficulty', () => {
    const block = blockchainService.mineBlock(blockchain, 'test data')
    const requiredZeros = '0'.repeat(blockchain.difficulty)
    
    expect(block.hash.startsWith(requiredZeros)).toBe(true)
  })
})
```

### E2E Testing (Cypress)

```typescript
describe('Blockchain Creation Flow', () => {
  it('should create blockchain successfully', () => {
    cy.visit('/create')
    
    cy.get('[data-testid="blockchain-name"]').type('TestCoin')
    cy.get('[data-testid="blockchain-symbol"]').type('TEST')
    cy.get('[data-testid="blockchain-description"]').type('Test blockchain')
    
    cy.get('[data-testid="create-blockchain-btn"]').click()
    
    cy.get('[data-testid="success-message"]').should('be.visible')
    cy.get('[data-testid="download-btn"]').should('be.enabled')
  })
})
```

## 📊 Performance Optimization

### Frontend Optimization

```typescript
// Lazy loading for better performance
const BlockchainVisualization = lazy(() => import('@/components/blockchain/BlockchainVisualization'))

// Memoization for expensive calculations
const MemoizedBlockchainCard = memo(({ blockchain }: { blockchain: Blockchain }) => {
  return <BlockchainCard blockchain={blockchain} />
})

// Virtual scrolling for large lists
const VirtualizedGallery = ({ blockchains }: { blockchains: Blockchain[] }) => {
  return (
    <FixedSizeList
      height={600}
      itemCount={blockchains.length}
      itemSize={200}
      itemData={blockchains}
    >
      {BlockchainItem}
    </FixedSizeList>
  )
}
```

### Backend Optimization

```typescript
// Caching frequently accessed data
const cache = new Map<string, any>()

const getCachedStats = async (): Promise<PlatformStats> => {
  const cacheKey = 'platform-stats'
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  
  const stats = await calculatePlatformStats()
  cache.set(cacheKey, stats)
  
  // Cache for 5 minutes
  setTimeout(() => cache.delete(cacheKey), 5 * 60 * 1000)
  
  return stats
}
```

## 🔧 Development Setup

### Prerequisites

```bash
# Required software
Node.js >= 18.0.0
npm >= 8.0.0
Git >= 2.0.0
```

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/blockchain-generator.git
cd blockchain-generator

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### Development Commands

```bash
# Start backend development server
cd backend && npm run dev

# Start frontend development server
cd frontend && npm run dev

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build

# Start production server
npm start
```

## 🐛 Debugging & Troubleshooting

### Common Issues

1. **Port Conflicts**: Ensure ports 3000 and 8001 are available
2. **CORS Errors**: Check FRONTEND_URL environment variable
3. **Rate Limiting**: Verify trust proxy settings for proper IP detection
4. **Mining Performance**: Adjust difficulty for testing vs production

### Debug Configuration

```typescript
// Enable detailed logging
const debug = require('debug')('blockchain-generator')

debug('Blockchain created:', blockchain.id)
debug('Mining started for block:', blockIndex)
debug('WebSocket connection established:', userId)
```

## 📝 Contributing Guidelines

### Code Style

```typescript
// Use TypeScript for type safety
interface BlockchainConfig {
  name: string
  symbol: string
  description: string
  difficulty: number
  reward: number
  maxSupply: number
}

// Use async/await for promises
const createBlockchain = async (config: BlockchainConfig): Promise<Blockchain> => {
  try {
    const blockchain = await blockchainService.create(config)
    return blockchain
  } catch (error) {
    logger.error('Failed to create blockchain:', error)
    throw error
  }
}
```

### Commit Messages

```bash
feat: Add blockchain export functionality
fix: Resolve mining progress WebSocket issue
docs: Update API documentation
test: Add unit tests for blockchain validation
refactor: Optimize mining algorithm performance
```

---

This technical documentation provides a comprehensive overview of the Blockchain Generator architecture, implementation details, and development guidelines. For user-facing documentation, see [README.md](README.md).
