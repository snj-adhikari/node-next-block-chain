import { Server as SocketIOServer, Socket } from 'socket.io';
import { MiningProgress } from './BlockchainService';

export interface NotificationData {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  data?: any;
}

export interface BlockchainProgressData extends MiningProgress {
  timestamp: string;
}

export class NotificationService {
  private io: SocketIOServer;
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Socket connected: ${socket.id}`);

      socket.on('join-user-room', (userId: string) => {
        if (userId) {
          socket.join(`user:${userId}`);
          
          // Track user sockets
          if (!this.userSockets.has(userId)) {
            this.userSockets.set(userId, new Set());
          }
          this.userSockets.get(userId)!.add(socket.id);
          
          console.log(`👤 User ${userId} joined room with socket ${socket.id}`);
          
          // Send welcome notification
          this.sendToUser(userId, 'notification', {
            type: 'info',
            title: 'Connected',
            message: 'Real-time notifications are now active',
            timestamp: new Date().toISOString()
          });
        }
      });

      socket.on('disconnect', () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
        
        // Remove socket from user tracking
        this.userSockets.forEach((sockets, userId) => {
          if (sockets.has(socket.id)) {
            sockets.delete(socket.id);
            if (sockets.size === 0) {
              this.userSockets.delete(userId);
            }
          }
        });
      });
    });
  }

  // Send notification to specific user
  sendToUser(userId: string, event: string, data: any): void {
    this.io.to(`user:${userId}`).emit(event, data);
  }

  // Send notification to all connected users
  broadcast(event: string, data: any): void {
    this.io.emit(event, data);
  }

  // Blockchain creation progress notifications
  notifyBlockchainProgress(userId: string, progress: MiningProgress): void {
    const progressData: BlockchainProgressData = {
      ...progress,
      timestamp: new Date().toISOString()
    };

    this.sendToUser(userId, 'blockchain:progress', progressData);

    // Also send general notification for major milestones
    if (progress.progress === 1) {
      this.sendToUser(userId, 'notification', {
        type: 'success',
        title: 'Block Mined!',
        message: `Block ${progress.blockIndex} has been successfully mined`,
        timestamp: new Date().toISOString(),
        data: { blockchainId: progress.blockchainId, blockIndex: progress.blockIndex }
      });
    }
  }

  // Blockchain creation completion
  notifyBlockchainComplete(userId: string, blockchainId: string, blockchainName: string): void {
    this.sendToUser(userId, 'blockchain:complete', {
      blockchainId,
      name: blockchainName,
      timestamp: new Date().toISOString()
    });

    this.sendToUser(userId, 'notification', {
      type: 'success',
      title: 'Blockchain Ready!',
      message: `Your blockchain "${blockchainName}" has been created successfully`,
      timestamp: new Date().toISOString(),
      data: { blockchainId }
    });
  }

  // Blockchain creation error
  notifyBlockchainError(userId: string, blockchainId: string, error: string): void {
    this.sendToUser(userId, 'blockchain:error', {
      blockchainId,
      error,
      timestamp: new Date().toISOString()
    });

    this.sendToUser(userId, 'notification', {
      type: 'error',
      title: 'Blockchain Creation Failed',
      message: error,
      timestamp: new Date().toISOString(),
      data: { blockchainId }
    });
  }

  // Publishing notifications
  notifyBlockchainPublished(userId: string, blockchainId: string, blockchainName: string): void {
    this.sendToUser(userId, 'notification', {
      type: 'success',
      title: 'Blockchain Published!',
      message: `Your blockchain "${blockchainName}" is now public`,
      timestamp: new Date().toISOString(),
      data: { blockchainId }
    });

    // Notify all users about new published blockchain
    this.broadcast('blockchain:published', {
      blockchainId,
      name: blockchainName,
      creator: userId,
      timestamp: new Date().toISOString()
    });
  }

  // System notifications
  notifySystemMaintenance(message: string, scheduledTime?: string): void {
    this.broadcast('notification', {
      type: 'warning',
      title: 'System Maintenance',
      message,
      timestamp: new Date().toISOString(),
      data: { scheduledTime }
    });
  }

  // Performance notifications (if blockchain takes too long)
  notifySlowMining(userId: string, blockchainId: string, estimatedTime: number): void {
    this.sendToUser(userId, 'notification', {
      type: 'warning',
      title: 'Mining Taking Longer Than Expected',
      message: `Your blockchain is still being mined. Estimated time: ${estimatedTime}s`,
      timestamp: new Date().toISOString(),
      data: { blockchainId, estimatedTime }
    });
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  // Get user connection status
  isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  // Send custom notification
  sendCustomNotification(userId: string, notification: NotificationData): void {
    this.sendToUser(userId, 'notification', notification);
  }

  // Bulk notification to multiple users
  sendBulkNotification(userIds: string[], notification: NotificationData): void {
    userIds.forEach(userId => {
      this.sendToUser(userId, 'notification', notification);
    });
  }

  // Mining status updates with detailed progress
  notifyMiningStatus(userId: string, status: {
    blockchainId: string;
    stage: 'starting' | 'mining' | 'validating' | 'complete' | 'error';
    currentBlock: number;
    totalBlocks?: number;
    hashRate?: number;
    timeElapsed?: number;
    timeRemaining?: number;
  }): void {
    this.sendToUser(userId, 'mining:status', {
      ...status,
      timestamp: new Date().toISOString()
    });
  }

  // Real-time stats updates
  broadcastStats(stats: {
    totalBlockchains: number;
    totalUsers: number;
    totalPublished: number;
    totalBlocks: number;
    activeMiners: number;
  }): void {
    this.broadcast('stats:update', {
      ...stats,
      timestamp: new Date().toISOString()
    });
  }
}
