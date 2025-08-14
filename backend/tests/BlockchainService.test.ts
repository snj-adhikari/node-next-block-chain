import { BlockchainService } from '../src/services/BlockchainService'
import { BlockchainConfig } from '../src/models/Blockchain'

describe('BlockchainService', () => {
  let blockchainService: BlockchainService

  beforeEach(() => {
    blockchainService = new BlockchainService()
  })

  describe('createBlockchain', () => {
    it('should create a blockchain with valid configuration', async () => {
      const config: BlockchainConfig = {
        name: 'TestCoin',
        description: 'A test cryptocurrency',
        difficulty: 3,
        miningReward: 50,
        maxSupply: 1000000
      }
      const userId = 'test-user-123'

      const blockchain = await blockchainService.createBlockchain(config, userId)

      expect(blockchain).toBeDefined()
      expect(blockchain.metadata.name).toBe(config.name)
      expect(blockchain.metadata.description).toBe(config.description)
      expect(blockchain.difficulty).toBe(config.difficulty)
      expect(blockchain.miningReward).toBe(config.miningReward)
      expect(blockchain.maxSupply).toBe(config.maxSupply)
      expect(blockchain.metadata.creator).toBe(userId)
      expect(blockchain.chain).toHaveLength(1) // Genesis block
      expect(blockchain.id).toBeDefined()
      expect(blockchain.metadata.createdAt).toBeDefined()
    })

    it('should create genesis block correctly', async () => {
      const config: BlockchainConfig = {
        name: 'TestCoin',
        description: 'A test cryptocurrency',
        difficulty: 2,
        miningReward: 25,
        maxSupply: 500000
      }

      const blockchain = await blockchainService.createBlockchain(config, 'test-user')
      const genesisBlock = blockchain.chain[0]

      expect(genesisBlock.index).toBe(0)
      expect(genesisBlock.previousHash).toBe('0')
      expect(genesisBlock.timestamp).toBeDefined()
      expect(genesisBlock.hash).toBeDefined()
      expect(genesisBlock.nonce).toBeDefined()
    })

    it('should handle different difficulty levels', async () => {
      const difficulties = [1, 2, 3, 4, 5, 6]

      for (const difficulty of difficulties) {
        const config: BlockchainConfig = {
          name: 'TestCoin',
          description: 'A test cryptocurrency',
          difficulty,
          miningReward: 50,
          maxSupply: 1000000
        }

        const blockchain = await blockchainService.createBlockchain(config, 'test-user')
        expect(blockchain.difficulty).toBe(difficulty)
        
        // Genesis block should have hash that matches difficulty
        const genesisBlock = blockchain.chain[0]
        const expectedPrefix = '0'.repeat(difficulty)
        expect(genesisBlock.hash.startsWith(expectedPrefix)).toBe(true)
      }
    })

    it('should generate unique blockchain IDs', async () => {
      const config: BlockchainConfig = {
        name: 'TestCoin',
        description: 'A test cryptocurrency',
        difficulty: 2,
        miningReward: 50,
        maxSupply: 1000000
      }

      const blockchain1 = await blockchainService.createBlockchain(config, 'user1')
      const blockchain2 = await blockchainService.createBlockchain(config, 'user2')

      expect(blockchain1.id).not.toBe(blockchain2.id)
    })

    it('should validate configuration and reject invalid data', async () => {
      const invalidConfig: BlockchainConfig = {
        name: 'Te', // Too short
        description: 'A test cryptocurrency',
        difficulty: 10, // Too high
        miningReward: 2000, // Too high
        maxSupply: -1000 // Negative
      }

      await expect(blockchainService.createBlockchain(invalidConfig, 'test-user'))
        .rejects.toThrow('Invalid blockchain configuration')
    })
  })

  describe('mineBlockchain', () => {
    it('should mine a new block', async () => {
      const config: BlockchainConfig = {
        name: 'TestCoin',
        description: 'A test cryptocurrency',
        difficulty: 1, // Low difficulty for faster testing
        miningReward: 50,
        maxSupply: 1000000
      }

      const blockchain = await blockchainService.createBlockchain(config, 'test-user')
      const initialBlockCount = blockchain.chain.length

      const minedBlockchain = await blockchainService.mineBlockchain(blockchain.id)

      expect(minedBlockchain.chain).toHaveLength(initialBlockCount + 1)
      
      const newBlock = minedBlockchain.chain[minedBlockchain.chain.length - 1]
      expect(newBlock.index).toBe(initialBlockCount)
      expect(newBlock.previousHash).toBe(blockchain.chain[initialBlockCount - 1].hash)
    })

    it('should prevent concurrent mining', async () => {
      const config: BlockchainConfig = {
        name: 'TestCoin',
        description: 'A test cryptocurrency',
        difficulty: 1,
        miningReward: 50,
        maxSupply: 1000000
      }

      const blockchain = await blockchainService.createBlockchain(config, 'test-user')

      // Start first mining operation
      const miningPromise1 = blockchainService.mineBlockchain(blockchain.id)
      
      // Try to start second mining operation immediately
      await expect(blockchainService.mineBlockchain(blockchain.id))
        .rejects.toThrow('Blockchain is already being mined')

      // Wait for first mining to complete
      await miningPromise1
    })

    it('should include transactions in mined block', async () => {
      const config: BlockchainConfig = {
        name: 'TestCoin',
        description: 'A test cryptocurrency',
        difficulty: 1,
        miningReward: 50,
        maxSupply: 1000000
      }

      const blockchain = await blockchainService.createBlockchain(config, 'test-user')
      
      const transactions = await blockchainService.createSampleTransactions(2)
      const minedBlockchain = await blockchainService.mineBlockchain(blockchain.id, transactions)

      expect(minedBlockchain.pendingTransactions).toHaveLength(0) // Should be cleared after mining
    })
  })

  describe('validateBlockchain', () => {
    it('should validate a valid blockchain', async () => {
      const config: BlockchainConfig = {
        name: 'TestCoin',
        description: 'A test cryptocurrency',
        difficulty: 1,
        miningReward: 50,
        maxSupply: 1000000
      }

      const blockchain = await blockchainService.createBlockchain(config, 'test-user')
      
      const validation = await blockchainService.validateBlockchain(blockchain.id)
      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should return false for non-existent blockchain', async () => {
      const validation = await blockchainService.validateBlockchain('non-existent-id')
      expect(validation.isValid).toBe(false)
      expect(validation.errors).toContain('Blockchain not found')
    })
  })

  describe('publishBlockchain', () => {
    it('should publish a blockchain successfully', async () => {
      const config: BlockchainConfig = {
        name: 'TestCoin',
        description: 'A test cryptocurrency',
        difficulty: 1,
        miningReward: 50,
        maxSupply: 1000000
      }

      const blockchain = await blockchainService.createBlockchain(config, 'test-user')
      
      const success = await blockchainService.publishBlockchain(blockchain.id, {
        description: 'Published for testing',
        tags: ['test', 'cryptocurrency']
      })

      expect(success).toBe(true)
      
      // Verify blockchain is published
      const updatedBlockchain = await blockchainService.getBlockchain(blockchain.id)
      expect(updatedBlockchain?.metadata.isPublished).toBe(true)
    })

    it('should fail to publish non-existent blockchain', async () => {
      await expect(blockchainService.publishBlockchain('non-existent-id'))
        .rejects.toThrow('Blockchain not found')
    })
  })

  describe('exportBlockchain', () => {
    it('should export blockchain in correct format', async () => {
      const config: BlockchainConfig = {
        name: 'TestCoin',
        description: 'A test cryptocurrency',
        difficulty: 1,
        miningReward: 50,
        maxSupply: 1000000
      }

      const blockchain = await blockchainService.createBlockchain(config, 'test-user')

      const exported = await blockchainService.exportBlockchain(blockchain.id)

      expect(exported).toBeDefined()
      expect(exported.id).toBe(blockchain.id)
      expect(exported.metadata.name).toBe(blockchain.metadata.name)
      expect(exported.chain).toHaveLength(blockchain.chain.length)
      expect(exported.exportedAt).toBeDefined()
      expect(exported.version).toBe('1.0.0')
    })

    it('should fail to export non-existent blockchain', async () => {
      await expect(blockchainService.exportBlockchain('non-existent-id'))
        .rejects.toThrow('Blockchain not found')
    })
  })

  describe('createSampleTransactions', () => {
    it('should create specified number of transactions', async () => {
      const transactions = await blockchainService.createSampleTransactions(5)
      
      expect(transactions).toHaveLength(5)
      transactions.forEach(transaction => {
        expect(transaction.from).toBeDefined()
        expect(transaction.to).toBeDefined()
        expect(transaction.amount).toBeGreaterThan(0)
        expect(transaction.timestamp).toBeDefined()
        expect(transaction.fee).toBeGreaterThanOrEqual(0)
        expect(transaction.from).not.toBe(transaction.to)
      })
    })

    it('should create default number of transactions when no count specified', async () => {
      const transactions = await blockchainService.createSampleTransactions()
      expect(transactions).toHaveLength(5)
    })
  })
})
