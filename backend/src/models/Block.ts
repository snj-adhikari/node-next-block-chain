import * as crypto from 'crypto';

export interface Transaction {
  from: string;
  to: string;
  amount: number;
  timestamp: string;
  fee?: number;
}

export class Block {
  public hash: string;
  public nonce: number = 0;
  public miningTime: number = 0;

  constructor(
    public index: number,
    public timestamp: string,
    public transactions: Transaction[],
    public previousHash: string = '',
    public creator?: string,
    public data?: string
  ) {
    this.hash = this.calculateHash();
  }

  calculateHash(): string {
    const blockData = {
      index: this.index,
      timestamp: this.timestamp,
      transactions: this.transactions,
      previousHash: this.previousHash,
      nonce: this.nonce,
      creator: this.creator || '',
      data: this.data || ''
    };

    return crypto.createHash('sha256')
      .update(JSON.stringify(blockData))
      .digest('hex');
  }

  async mineBlock(
    difficulty: number,
    onProgress?: (progress: number, hash: string, nonce: number) => void
  ): Promise<void> {
    const target = '0'.repeat(difficulty);
    const startTime = Date.now();
    let attempts = 0;
    
    console.log(`🔨 Mining block ${this.index} with difficulty ${difficulty}...`);
    
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
      attempts++;
      
      // Report progress every 5000 attempts to avoid overwhelming
      if (attempts % 5000 === 0 && onProgress) {
        // Estimate progress based on hash difficulty (rough estimation)
        const progress = Math.min(attempts / (Math.pow(16, difficulty) / 1000), 0.99);
        onProgress(progress, this.hash, this.nonce);
      }
      
      // Allow event loop to breathe every 50000 attempts
      if (attempts % 50000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
    
    this.miningTime = Date.now() - startTime;
    console.log(`✅ Block ${this.index} mined! Hash: ${this.hash} | Time: ${this.miningTime}ms | Nonce: ${this.nonce}`);
    
    if (onProgress) {
      onProgress(1, this.hash, this.nonce);
    }
  }

  validate(previousBlock?: Block): { isValid: boolean; error?: string } {
    // Check if hash is calculated correctly
    const calculatedHash = this.calculateHash();
    if (calculatedHash !== this.hash) {
      return { isValid: false, error: 'Hash mismatch' };
    }

    // Check if previous hash matches
    if (previousBlock && this.previousHash !== previousBlock.hash) {
      return { isValid: false, error: 'Previous hash mismatch' };
    }

    // Check if index is sequential
    if (previousBlock && this.index !== previousBlock.index + 1) {
      return { isValid: false, error: 'Index not sequential' };
    }

    // Check if timestamp is reasonable
    const currentTime = Date.now();
    const blockTime = new Date(this.timestamp).getTime();
    if (blockTime > currentTime + 60000) { // Allow 1 minute future time
      return { isValid: false, error: 'Block timestamp too far in future' };
    }

    return { isValid: true };
  }

  toJSON() {
    return {
      index: this.index,
      timestamp: this.timestamp,
      transactions: this.transactions,
      previousHash: this.previousHash,
      hash: this.hash,
      nonce: this.nonce,
      creator: this.creator,
      data: this.data,
      miningTime: this.miningTime
    };
  }
}
