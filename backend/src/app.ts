import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import { BlockchainService } from './services/BlockchainService';
import { NotificationService } from './services/NotificationService';
import { FileService } from './services/FileService';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Initialize services
const fileService = new FileService();
const blockchainService = new BlockchainService();
const notificationService = new NotificationService(io);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Needed for development
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

// CORS setup
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const miningLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit mining requests to 5 per minute
  message: 'Mining rate limit exceeded, please wait before starting another mining operation.'
});

app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    connectedUsers: notificationService.getConnectedUsersCount()
  });
});

// API Routes

// Get system statistics
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await blockchainService.getBlockchainStats();
    const connectedUsers = notificationService.getConnectedUsersCount();
    
    res.json({
      ...stats,
      connectedUsers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Create new blockchain
app.post('/api/blockchain/create', async (req, res) => {
  try {
    const { config, userId } = req.body;
    
    if (!config || !userId) {
      return res.status(400).json({ error: 'Config and userId are required' });
    }

    console.log(`🏗️ Creating blockchain for user ${userId}:`, config);

    const blockchain = await blockchainService.createBlockchain(config, userId);
    
    // Send creation success notification
    notificationService.sendToUser(userId, 'notification', {
      type: 'success',
      title: 'Blockchain Created',
      message: `Blockchain "${config.name}" has been initialized`,
      timestamp: new Date().toISOString(),
      data: { blockchainId: blockchain.id }
    });

    return res.status(201).json({
      success: true,
      blockchain: blockchain.toJSON()
    });
  } catch (error) {
    console.error('Error creating blockchain:', error);
    return res.status(500).json({ 
      error: 'Failed to create blockchain',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Mine blockchain with progress updates
app.post('/api/blockchain/:id/mine', miningLimiter, async (req, res) => {
  try {
    const { id } = req.params;
    const { transactions = [], userId } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Blockchain ID is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`⛏️ Starting mining for blockchain ${id}`);

    // Check if blockchain exists and user owns it
    const blockchain = await blockchainService.getBlockchain(id);
    if (!blockchain) {
      return res.status(404).json({ error: 'Blockchain not found' });
    }

    if (blockchain.metadata.creator !== userId) {
      return res.status(403).json({ error: 'Unauthorized: You can only mine your own blockchains' });
    }

    // Check if already mining
    if (blockchainService.isBlockchainMining(id)) {
      return res.status(409).json({ error: 'Blockchain is already being mined' });
    }

    // Start mining with progress notifications
    const minedBlockchain = await blockchainService.mineBlockchain(
      id, 
      transactions,
      (progress) => {
        notificationService.notifyBlockchainProgress(userId, progress);
      }
    );

    // Send completion notification
    notificationService.notifyBlockchainComplete(
      userId, 
      minedBlockchain.id, 
      minedBlockchain.metadata.name
    );

    return res.json({
      success: true,
      blockchain: minedBlockchain.toJSON()
    });
  } catch (error) {
    console.error('Error mining blockchain:', error);
    
    const { id } = req.params;
    const { userId } = req.body;
    
    if (userId && id) {
      notificationService.notifyBlockchainError(
        userId, 
        id, 
        error instanceof Error ? error.message : 'Mining failed'
      );
    }

    return res.status(500).json({ 
      error: 'Failed to mine blockchain',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get blockchain by ID
app.get('/api/blockchain/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Blockchain ID is required' });
    }
    
    const blockchain = await blockchainService.getBlockchain(id);
    
    if (!blockchain) {
      return res.status(404).json({ error: 'Blockchain not found' });
    }

    return res.json({
      success: true,
      blockchain: blockchain.toJSON()
    });
  } catch (error) {
    console.error('Error fetching blockchain:', error);
    return res.status(500).json({ error: 'Failed to fetch blockchain' });
  }
});

// Get user's blockchains
app.get('/api/user/:userId/blockchains', async (req, res) => {
  try {
    const { userId } = req.params;
    const blockchains = await blockchainService.getUserBlockchains(userId);
    
    res.json({
      success: true,
      blockchains: blockchains.map(b => b.toJSON())
    });
  } catch (error) {
    console.error('Error fetching user blockchains:', error);
    res.status(500).json({ error: 'Failed to fetch user blockchains' });
  }
});

// Get published blockchains
app.get('/api/blockchains/published', async (req, res) => {
  try {
    const blockchains = await blockchainService.getPublishedBlockchains();
    
    res.json({
      success: true,
      blockchains: blockchains.map(b => ({
        id: b.id,
        metadata: b.metadata,
        difficulty: b.difficulty,
        validation: b.validateChain()
      }))
    });
  } catch (error) {
    console.error('Error fetching published blockchains:', error);
    res.status(500).json({ error: 'Failed to fetch published blockchains' });
  }
});

// Publish blockchain
app.post('/api/blockchain/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const { publishData, userId } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Blockchain ID is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Verify ownership
    const blockchain = await blockchainService.getBlockchain(id);
    if (!blockchain) {
      return res.status(404).json({ error: 'Blockchain not found' });
    }

    if (blockchain.metadata.creator !== userId) {
      return res.status(403).json({ error: 'Unauthorized: You can only publish your own blockchains' });
    }

    const success = await blockchainService.publishBlockchain(id, publishData);
    
    if (success) {
      notificationService.notifyBlockchainPublished(userId, id, blockchain.metadata.name);
    }

    return res.json({ success });
  } catch (error) {
    console.error('Error publishing blockchain:', error);
    return res.status(500).json({ error: 'Failed to publish blockchain' });
  }
});

// Unpublish blockchain
app.post('/api/blockchain/:id/unpublish', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Blockchain ID is required' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Verify ownership
    const blockchain = await blockchainService.getBlockchain(id);
    if (!blockchain) {
      return res.status(404).json({ error: 'Blockchain not found' });
    }

    if (blockchain.metadata.creator !== userId) {
      return res.status(403).json({ error: 'Unauthorized: You can only unpublish your own blockchains' });
    }

    const success = await blockchainService.unpublishBlockchain(id);
    return res.json({ success });
  } catch (error) {
    console.error('Error unpublishing blockchain:', error);
    return res.status(500).json({ error: 'Failed to unpublish blockchain' });
  }
});

// Delete blockchain
app.delete('/api/blockchain/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const success = await blockchainService.deleteBlockchain(id, userId);
    res.json({ success });
  } catch (error) {
    console.error('Error deleting blockchain:', error);
    res.status(500).json({ 
      error: 'Failed to delete blockchain',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Export blockchain
app.get('/api/blockchain/:id/export', async (req, res) => {
  try {
    const { id } = req.params;
    const exportData = await blockchainService.exportBlockchain(id);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="blockchain-${id}.json"`);
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting blockchain:', error);
    res.status(500).json({ error: 'Failed to export blockchain' });
  }
});

// Generate sample transactions
app.get('/api/transactions/sample/:count?', async (req, res) => {
  try {
    const count = parseInt(req.params.count || '5');
    const transactions = await blockchainService.createSampleTransactions(Math.min(count, 20));
    
    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Error generating sample transactions:', error);
    res.status(500).json({ error: 'Failed to generate sample transactions' });
  }
});

// Validate blockchain
app.get('/api/blockchain/:id/validate', async (req, res) => {
  try {
    const { id } = req.params;
    const validation = await blockchainService.validateBlockchain(id);
    
    res.json({
      success: true,
      validation
    });
  } catch (error) {
    console.error('Error validating blockchain:', error);
    res.status(500).json({ error: 'Failed to validate blockchain' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Blockchain Generator API server running on port ${PORT}`);
  console.log(`🔌 Socket.IO server ready for real-time notifications`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

export { app, server, io };
