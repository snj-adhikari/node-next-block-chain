import { Block, Transaction } from '../src/models/Block';

describe('Block Model', () => {
  let block: Block;
  let sampleTransactions: Transaction[];
  
  beforeEach(() => {
    sampleTransactions = [
      {
        from: 'genesis',
        to: 'user1',
        amount: 100,
        timestamp: new Date().toISOString(),
        fee: 1
      }
    ];
    block = new Block(0, new Date().toISOString(), sampleTransactions, '0', 'system');
  });

  test('should create a block with correct properties', () => {
    expect(block.index).toBe(0);
    expect(block.transactions).toEqual(sampleTransactions);
    expect(block.previousHash).toBe('0');
    expect(block.creator).toBe('system');
    expect(block.hash).toBeDefined();
    expect(block.nonce).toBe(0);
  });

  test('should calculate hash correctly', () => {
    const initialHash = block.hash;
    expect(typeof initialHash).toBe('string');
    expect(initialHash.length).toBeGreaterThan(0);
    
    // Recalculate and verify
    const calculatedHash = block.calculateHash();
    expect(calculatedHash).toBe(initialHash);
  });

  test('should mine block with specified difficulty', async () => {
    const difficulty = 2;
    const startTime = Date.now();
    
    await block.mineBlock(difficulty, (progress, hash, nonce) => {
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(1);
      expect(typeof hash).toBe('string');
      expect(nonce).toBeGreaterThanOrEqual(0);
    });
    
    const endTime = Date.now();
    expect(endTime - startTime).toBeGreaterThan(0);
    expect(block.hash.substring(0, difficulty)).toBe('0'.repeat(difficulty));
    expect(block.nonce).toBeGreaterThan(0);
    expect(block.miningTime).toBeGreaterThan(0);
  });

  test('should validate block correctly', () => {
    const validation = block.validate();
    expect(validation.isValid).toBe(true);
    expect(validation.error).toBeUndefined();
    
    // Test with previous block
    const previousBlock = new Block(0, new Date().toISOString(), [], '0');
    const nextBlock = new Block(1, new Date().toISOString(), sampleTransactions, previousBlock.hash);
    
    const nextValidation = nextBlock.validate(previousBlock);
    expect(nextValidation.isValid).toBe(true);
  });

  test('should fail validation with tampered hash', () => {
    // Tamper with the block
    block.hash = 'tampered_hash';
    const validation = block.validate();
    expect(validation.isValid).toBe(false);
    expect(validation.error).toBe('Hash mismatch');
  });

  test('should serialize to JSON correctly', () => {
    const json = block.toJSON();
    expect(json.index).toBe(block.index);
    expect(json.transactions).toEqual(block.transactions);
    expect(json.hash).toBe(block.hash);
    expect(json.nonce).toBe(block.nonce);
    expect(json.creator).toBe(block.creator);
  });
});
