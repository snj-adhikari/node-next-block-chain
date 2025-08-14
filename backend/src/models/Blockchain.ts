import { randomUUID } from 'crypto';
import { Block, Transaction } from './Block';

export interface BlockchainConfig {
  name: string;
  description?: string;
  difficulty: number;
  miningReward: number;
  maxSupply?: number;
  genesisData?: string;
  tags?: string[];
}

export interface BlockchainMetadata {
  id: string;
  name: string;
  description: string;
  creator: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  publishedAt?: string;
  tags: string[];
  stats: {
    totalBlocks: number;
    totalTransactions: number;
    avgMiningTime: number;
    totalMiningTime: number;
    difficulty: number;
  };
}

export enum BlockchainStatus {
  CREATING = 'creating',
  MINING = 'mining',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export class Blockchain {
  public id: string;
  public chain: Block[];
  public difficulty: number;
  public miningReward: number;
  public maxSupply?: number;
  public pendingTransactions: Transaction[];
  public metadata: BlockchainMetadata;
  public status: BlockchainStatus;

  constructor(config: BlockchainConfig, creator: string) {
    this.id = randomUUID();
    this.difficulty = Math.max(1, Math.min(config.difficulty, 6)); // Limit difficulty for performance
    this.miningReward = config.miningReward;
    this.maxSupply = config.maxSupply;
    this.pendingTransactions = [];
    this.status = BlockchainStatus.CREATING;
    
    this.metadata = {
      id: this.id,
      name: config.name,
      description: config.description || '',
      creator,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false,
      tags: config.tags || [],
      stats: {
        totalBlocks: 0,
        totalTransactions: 0,
        avgMiningTime: 0,
        totalMiningTime: 0,
        difficulty: this.difficulty,
      },
    };
    
    this.chain = [this.createGenesisBlock(config.genesisData)];
    this.updateStats();
  }

  private createGenesisBlock(genesisData?: string): Block {
    const genesisBlock = new Block(
      0,
      new Date().toISOString(),
      [],
      '0',
      this.metadata.creator,
      genesisData || 'Genesis Block - The beginning of a new blockchain'
    );
    
    // Genesis block doesn't need to be mined
    genesisBlock.hash = genesisBlock.calculateHash();
    return genesisBlock;
  }

  getLatestBlock(): Block {
    const block = this.chain[this.chain.length - 1];
    if (!block) {
      throw new Error('No blocks in blockchain');
    }
    return block;
  }

  addTransaction(transaction: Transaction): boolean {
    // Basic validation
    if (!transaction.from || !transaction.to || transaction.amount <= 0) {
      return false;
    }

    // Add timestamp if not provided
    if (!transaction.timestamp) {
      transaction.timestamp = new Date().toISOString();
    }

    this.pendingTransactions.push(transaction);
    return true;
  }

  async mineBlock(
    onProgress?: (progress: number, stage: string, blockIndex: number) => void
  ): Promise<Block> {
    this.status = BlockchainStatus.MINING;
    
    // Add mining reward transaction
    if (this.miningReward > 0) {
      this.pendingTransactions.push({
        from: 'system',
        to: this.metadata.creator,
        amount: this.miningReward,
        timestamp: new Date().toISOString(),
      });
    }

    const block = new Block(
      this.chain.length,
      new Date().toISOString(),
      [...this.pendingTransactions], // Copy transactions
      this.getLatestBlock().hash,
      this.metadata.creator
    );

    if (onProgress) {
      onProgress(0, `Mining block ${block.index}`, block.index);
    }

    // Mine the block with progress callback
    await block.mineBlock(this.difficulty, (progress, hash, nonce) => {
      if (onProgress) {
        onProgress(progress, `Mining block ${block.index} (${hash.substring(0, 8)}... nonce: ${nonce})`, block.index);
      }
    });

    // Add block to chain
    this.chain.push(block);
    this.pendingTransactions = [];
    this.status = BlockchainStatus.COMPLETED;
    this.metadata.updatedAt = new Date().toISOString();
    
    // Update statistics
    this.updateStats();

    if (onProgress) {
      onProgress(1, `Block ${block.index} mined successfully!`, block.index);
    }

    return block;
  }

  private updateStats(): void {
    const blocks = this.chain.slice(1); // Exclude genesis block from mining stats
    
    this.metadata.stats.totalBlocks = this.chain.length;
    this.metadata.stats.totalTransactions = this.chain.reduce(
      (total, block) => total + block.transactions.length, 0
    );
    
    if (blocks.length > 0) {
      this.metadata.stats.totalMiningTime = blocks.reduce(
        (total, block) => total + block.miningTime, 0
      );
      this.metadata.stats.avgMiningTime = this.metadata.stats.totalMiningTime / blocks.length;
    }
  }

  validateChain(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate each block
    for (let i = 0; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = i > 0 ? this.chain[i - 1] : undefined;
      
      if (!currentBlock) {
        errors.push(`Block ${i}: Block is missing`);
        continue;
      }
      
      const validation = currentBlock.validate(previousBlock);
      if (!validation.isValid) {
        errors.push(`Block ${i}: ${validation.error}`);
      }

      // Additional blockchain-specific validations
      if (i > 0) {
        // Check if difficulty requirement is met (except genesis)
        const requiredZeros = '0'.repeat(this.difficulty);
        if (!currentBlock.hash.startsWith(requiredZeros)) {
          errors.push(`Block ${i}: Hash doesn't meet difficulty requirement`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  publish(publishData?: { description?: string; tags?: string[] }): boolean {
    if (this.status !== BlockchainStatus.COMPLETED) {
      return false;
    }

    this.metadata.isPublished = true;
    this.metadata.publishedAt = new Date().toISOString();
    this.metadata.updatedAt = new Date().toISOString();
    
    if (publishData) {
      if (publishData.description) {
        this.metadata.description = publishData.description;
      }
      if (publishData.tags) {
        this.metadata.tags = publishData.tags;
      }
    }

    return true;
  }

  unpublish(): boolean {
    this.metadata.isPublished = false;
    this.metadata.publishedAt = undefined;
    this.metadata.updatedAt = new Date().toISOString();
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      metadata: this.metadata,
      difficulty: this.difficulty,
      miningReward: this.miningReward,
      maxSupply: this.maxSupply,
      status: this.status,
      chain: this.chain.map(block => block.toJSON()),
      pendingTransactions: this.pendingTransactions,
      validation: this.validateChain()
    };
  }

  // Create blockchain from JSON data
  static fromJSON(data: any): Blockchain {
    const blockchain = Object.create(Blockchain.prototype);
    blockchain.id = data.id;
    blockchain.metadata = data.metadata;
    blockchain.difficulty = data.difficulty;
    blockchain.miningReward = data.miningReward;
    blockchain.maxSupply = data.maxSupply;
    blockchain.status = data.status || BlockchainStatus.COMPLETED;
    blockchain.pendingTransactions = data.pendingTransactions || [];
    
    // Reconstruct blocks
    blockchain.chain = data.chain.map((blockData: any) => {
      const block = Object.create(Block.prototype);
      Object.assign(block, blockData);
      return block;
    });
    
    return blockchain;
  }
}
