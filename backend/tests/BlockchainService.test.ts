import { BlockchainService } from '../src/services/BlockchainService';
import { BlockchainConfig } from '../src/models/Blockchain';

describe('BlockchainService', () => {
  let blockchainService: BlockchainService;

  beforeEach(async () => {
    blockchainService = new BlockchainService();
    await blockchainService.fileService.saveBlockchains([]);
  });

  it('should create a new blockchain', async () => {
    const config: BlockchainConfig = {
      name: 'Test Blockchain',
      difficulty: 2,
      miningReward: 50,
    };

    const blockchain = await blockchainService.createBlockchain(config, 'test-user');

    expect(blockchain).toBeDefined();
    expect(blockchain.metadata.name).toBe('Test Blockchain');
    expect(blockchain.difficulty).toBe(2);
    expect(blockchain.miningReward).toBe(50);
    expect(blockchain.metadata.creator).toBe('test-user');
  });

  it('should get a blockchain by id', async () => {
    const config: BlockchainConfig = {
      name: 'Test Blockchain',
      difficulty: 2,
      miningReward: 50,
    };

    const blockchain = await blockchainService.createBlockchain(config, 'test-user');
    const fetchedBlockchain = await blockchainService.getBlockchain(blockchain.id);

    expect(fetchedBlockchain).toBeDefined();
    expect(fetchedBlockchain.id).toBe(blockchain.id);
  });

  it('should get user blockchains', async () => {
    const config: BlockchainConfig = {
      name: 'Test Blockchain',
      difficulty: 2,
      miningReward: 50,
    };

    await blockchainService.createBlockchain(config, 'test-user');
    const userBlockchains = await blockchainService.getUserBlockchains('test-user');

    expect(userBlockchains).toBeDefined();
    expect(userBlockchains.length).toBe(1);
    expect(userBlockchains[0].metadata.creator).toBe('test-user');
  });

  it('should get published blockchains', async () => {
    const config: BlockchainConfig = {
      name: 'Test Blockchain',
      difficulty: 2,
      miningReward: 50,
    };

    const blockchain = await blockchainService.createBlockchain(config, 'test-user');
    await blockchainService.mineBlockchain(blockchain.id);
    await blockchainService.publishBlockchain(blockchain.id);
    const publishedBlockchains = await blockchainService.getPublishedBlockchains();

    expect(publishedBlockchains).toBeDefined();
    expect(publishedBlockchains.length).toBe(1);
    expect(publishedBlockchains[0].metadata.isPublished).toBe(true);
  });

  it('should mine a blockchain', async () => {
    const config: BlockchainConfig = {
      name: 'Test Blockchain',
      difficulty: 1,
      miningReward: 50,
    };

    const blockchain = await blockchainService.createBlockchain(config, 'test-user');
    const minedBlockchain = await blockchainService.mineBlockchain(blockchain.id);

    expect(minedBlockchain).toBeDefined();
    expect(minedBlockchain.chain.length).toBe(2);
  });

  it('should publish and unpublish a blockchain', async () => {
    const config: BlockchainConfig = {
      name: 'Test Blockchain',
      difficulty: 2,
      miningReward: 50,
    };

    const blockchain = await blockchainService.createBlockchain(config, 'test-user');
    await blockchainService.mineBlockchain(blockchain.id);
    await blockchainService.publishBlockchain(blockchain.id);
    let fetchedBlockchain = await blockchainService.getBlockchain(blockchain.id);
    expect(fetchedBlockchain.metadata.isPublished).toBe(true);

    await blockchainService.unpublishBlockchain(blockchain.id);
    fetchedBlockchain = await blockchainService.getBlockchain(blockchain.id);
    expect(fetchedBlockchain.metadata.isPublished).toBe(false);
  });

  it('should delete a blockchain', async () => {
    const config: BlockchainConfig = {
      name: 'Test Blockchain',
      difficulty: 2,
      miningReward: 50,
    };

    const blockchain = await blockchainService.createBlockchain(config, 'test-user');
    await blockchainService.deleteBlockchain(blockchain.id, 'test-user');
    const fetchedBlockchain = await blockchainService.getBlockchain(blockchain.id);

    expect(fetchedBlockchain).toBeNull();
  });
});
