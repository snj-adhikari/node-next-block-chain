import { Blockchain, BlockchainConfig, BlockchainStatus } from '../models/Blockchain';
import { Transaction } from '../models/Block';
import { FileService } from './FileService';

export interface MiningProgress {
  blockchainId: string;
  stage: string;
  progress: number;
  blockIndex: number;
  message: string;
}

export class BlockchainService {
  private fileService: FileService;
  private activeMiners: Map<string, boolean> = new Map();

  constructor() {
    this.fileService = new FileService();
  }

  async createBlockchain(config: BlockchainConfig, creatorId: string): Promise<Blockchain> {
    console.log(`📦 Creating new blockchain "${config.name}" for user ${creatorId}`);
    
    // Validate configuration
    const validationResult = this.validateBlockchainConfig(config);
    if (!validationResult.isValid) {
      throw new Error(`Invalid blockchain configuration: ${validationResult.errors.join(', ')}`);
    }

    // Create blockchain instance
    const blockchain = new Blockchain(config, creatorId);
    
    // Save to storage
    await this.fileService.saveBlockchain(blockchain.toJSON());
    
    console.log(`✅ Blockchain "${config.name}" created with ID: ${blockchain.id}`);
    return blockchain;
  }

  async getBlockchain(blockchainId: string): Promise<Blockchain | null> {
    const blockchainData = await this.fileService.findBlockchainById(blockchainId);
    if (!blockchainData) {
      return null;
    }

    return Blockchain.fromJSON(blockchainData);
  }

  async getUserBlockchains(userId: string): Promise<Blockchain[]> {
    const blockchainsData = await this.fileService.findBlockchainsByUser(userId);
    return blockchainsData.map(data => Blockchain.fromJSON(data));
  }

  async getPublishedBlockchains(): Promise<Blockchain[]> {
    const publishedData = await this.fileService.readPublishedBlockchains();
    return publishedData.map(data => Blockchain.fromJSON(data));
  }

  async mineBlockchain(
    blockchainId: string,
    transactions: Transaction[] = [],
    onProgress?: (progress: MiningProgress) => void
  ): Promise<Blockchain> {
    // Check if already mining
    if (this.activeMiners.get(blockchainId)) {
      throw new Error('Blockchain is already being mined');
    }

    this.activeMiners.set(blockchainId, true);
    
    try {
      const blockchain = await this.getBlockchain(blockchainId);
      if (!blockchain) {
        throw new Error('Blockchain not found');
      }

      // Add transactions if provided
      transactions.forEach(transaction => {
        blockchain.addTransaction(transaction);
      });

      // Mine new block with progress updates
      console.log(`⛏️ Starting mining process for blockchain ${blockchainId}`);
      
      const block = await blockchain.mineBlock((progress, stage, blockIndex) => {
        if (onProgress) {
          onProgress({
            blockchainId,
            stage,
            progress,
            blockIndex,
            message: stage
          });
        }
      });

      // Save updated blockchain
      await this.fileService.saveBlockchain(blockchain.toJSON());
      
      console.log(`🎉 Successfully mined block ${block.index} for blockchain ${blockchainId}`);
      return blockchain;
    } finally {
      this.activeMiners.delete(blockchainId);
    }
  }

  async publishBlockchain(
    blockchainId: string,
    publishData?: { description?: string; tags?: string[] }
  ): Promise<boolean> {
    const blockchain = await this.getBlockchain(blockchainId);
    if (!blockchain) {
      throw new Error('Blockchain not found');
    }

    const success = blockchain.publish(publishData);
    if (success) {
      await this.fileService.saveBlockchain(blockchain.toJSON());
      console.log(`📢 Published blockchain ${blockchainId}`);
    }

    return success;
  }

  async unpublishBlockchain(blockchainId: string): Promise<boolean> {
    const blockchain = await this.getBlockchain(blockchainId);
    if (!blockchain) {
      throw new Error('Blockchain not found');
    }

    const success = blockchain.unpublish();
    if (success) {
      await this.fileService.saveBlockchain(blockchain.toJSON());
      console.log(`🔒 Unpublished blockchain ${blockchainId}`);
    }

    return success;
  }

  async deleteBlockchain(blockchainId: string, userId: string): Promise<boolean> {
    const blockchain = await this.getBlockchain(blockchainId);
    if (!blockchain) {
      return false;
    }

    // Check ownership
    if (blockchain.metadata.creator !== userId) {
      throw new Error('Unauthorized: You can only delete your own blockchains');
    }

    // Delete from storage
    const success = await this.fileService.deleteBlockchain(blockchainId);
    if (success) {
      console.log(`🗑️ Deleted blockchain ${blockchainId}`);
    }

    return success;
  }

  async validateBlockchain(blockchainId: string): Promise<{ isValid: boolean; errors: string[] }> {
    const blockchain = await this.getBlockchain(blockchainId);
    if (!blockchain) {
      return { isValid: false, errors: ['Blockchain not found'] };
    }

    return blockchain.validateChain();
  }

  async getBlockchainStats() {
    return await this.fileService.getBlockchainStats();
  }

  async exportBlockchain(blockchainId: string): Promise<any> {
    const blockchain = await this.getBlockchain(blockchainId);
    if (!blockchain) {
      throw new Error('Blockchain not found');
    }

    return {
      ...blockchain.toJSON(),
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  async importBlockchain(blockchainData: any, userId: string): Promise<Blockchain> {
    // Validate imported data
    if (!blockchainData.id || !blockchainData.chain || !Array.isArray(blockchainData.chain)) {
      throw new Error('Invalid blockchain data');
    }

    // Create blockchain from imported data
    const blockchain = Blockchain.fromJSON(blockchainData);
    
    // Update creator and metadata
    blockchain.metadata.creator = userId;
    blockchain.metadata.isPublished = false; // Imported blockchains are private by default
    blockchain.metadata.updatedAt = new Date().toISOString();

    // Validate the imported blockchain
    const validation = blockchain.validateChain();
    if (!validation.isValid) {
      throw new Error(`Invalid blockchain: ${validation.errors.join(', ')}`);
    }

    // Save imported blockchain
    await this.fileService.saveBlockchain(blockchain.toJSON());
    
    console.log(`📥 Imported blockchain ${blockchain.id} for user ${userId}`);
    return blockchain;
  }

  private validateBlockchainConfig(config: BlockchainConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.name || config.name.trim().length < 3) {
      errors.push('Blockchain name must be at least 3 characters long');
    }

    if (config.name && config.name.length > 50) {
      errors.push('Blockchain name must be less than 50 characters');
    }

    if (config.difficulty < 1 || config.difficulty > 6) {
      errors.push('Difficulty must be between 1 and 6');
    }

    if (config.miningReward < 0 || config.miningReward > 1000) {
      errors.push('Mining reward must be between 0 and 1000');
    }

    if (config.maxSupply && config.maxSupply < 0) {
      errors.push('Max supply must be positive');
    }

    if (config.description && config.description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isBlockchainMining(blockchainId: string): boolean {
    return this.activeMiners.get(blockchainId) || false;
  }

  async createSampleTransactions(count: number = 5): Promise<Transaction[]> {
    const sampleAddresses = [
      'wallet1a2b3c4d5e6f',
      'wallet2b3c4d5e6f7a',
      'wallet3c4d5e6f7a8b',
      'wallet4d5e6f7a8b9c',
      'wallet5e6f7a8b9c0d'
    ];

    const transactions: Transaction[] = [];
    
    for (let i = 0; i < count; i++) {
      const fromIndex = Math.floor(Math.random() * sampleAddresses.length);
      let toIndex = Math.floor(Math.random() * sampleAddresses.length);
      
      // Ensure from and to are different
      while (toIndex === fromIndex) {
        toIndex = Math.floor(Math.random() * sampleAddresses.length);
      }

      transactions.push({
        from: sampleAddresses[fromIndex]!,
        to: sampleAddresses[toIndex]!,
        amount: Math.round((Math.random() * 100) * 100) / 100, // Random amount with 2 decimals
        timestamp: new Date().toISOString(),
        fee: Math.round((Math.random() * 5) * 100) / 100 // Random fee
      });
    }

    return transactions;
  }
}
