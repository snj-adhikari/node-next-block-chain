import * as fs from 'fs/promises';
import * as path from 'path';
import { User } from '../models/User';

export class FileService {
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), 'backend/data');
    this.ensureDataDirectory();
  }

  private async ensureDataDirectory(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  private async readJsonFile<T>(filename: string): Promise<T[]> {
    const filePath = path.join(this.dataDir, filename);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist or is empty, return empty array
      return [];
    }
  }

  private async writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
    const filePath = path.join(this.dataDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  // User operations
  async readUsers(): Promise<User[]> {
    return this.readJsonFile<User>('users.json');
  }

  async saveUsers(users: User[]): Promise<void> {
    await this.writeJsonFile('users.json', users);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.readUsers();
    return users.find(user => user.email === email) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    const users = await this.readUsers();
    return users.find(user => user.id === id) || null;
  }

  async saveUser(user: User): Promise<User> {
    const users = await this.readUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }

    await this.saveUsers(users);
    return user;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const users = await this.readUsers();
    const initialLength = users.length;
    const filteredUsers = users.filter(user => user.id !== userId);
    
    if (filteredUsers.length < initialLength) {
      await this.saveUsers(filteredUsers);
      return true;
    }
    return false;
  }

  // Blockchain operations
  async readBlockchains(): Promise<any[]> {
    return this.readJsonFile<any>('blockchains.json');
  }

  async saveBlockchains(blockchains: any[]): Promise<void> {
    await this.writeJsonFile('blockchains.json', blockchains);
  }

  async findBlockchainById(id: string): Promise<any | null> {
    const blockchains = await this.readBlockchains();
    return blockchains.find(blockchain => blockchain.id === id) || null;
  }

  async findBlockchainsByUser(userId: string): Promise<any[]> {
    const blockchains = await this.readBlockchains();
    return blockchains.filter(blockchain => blockchain.metadata.creator === userId);
  }

  async saveBlockchain(blockchain: any): Promise<any> {
    const blockchains = await this.readBlockchains();
    const existingIndex = blockchains.findIndex(b => b.id === blockchain.id);
    
    if (existingIndex >= 0) {
      blockchains[existingIndex] = blockchain;
    } else {
      blockchains.push(blockchain);
    }

    await this.saveBlockchains(blockchains);
    return blockchain;
  }

  async deleteBlockchain(blockchainId: string): Promise<boolean> {
    const blockchains = await this.readBlockchains();
    const initialLength = blockchains.length;
    const filteredBlockchains = blockchains.filter(blockchain => blockchain.id !== blockchainId);
    
    if (filteredBlockchains.length < initialLength) {
      await this.saveBlockchains(filteredBlockchains);
      return true;
    }
    return false;
  }

  // Published blockchains operations
  async readPublishedBlockchains(): Promise<any[]> {
    const blockchains = await this.readBlockchains();
    return blockchains.filter(blockchain => blockchain.metadata.isPublished);
  }

  async getBlockchainStats(): Promise<{
    totalBlockchains: number;
    totalUsers: number;
    totalPublished: number;
    totalBlocks: number;
  }> {
    const blockchains = await this.readBlockchains();
    const users = await this.readUsers();
    const published = blockchains.filter(b => b.metadata.isPublished);
    const totalBlocks = blockchains.reduce((sum, b) => sum + (b.metadata?.stats?.totalBlocks || 0), 0);

    return {
      totalBlockchains: blockchains.length,
      totalUsers: users.length,
      totalPublished: published.length,
      totalBlocks
    };
  }

  // Generic file operations for backward compatibility
  async writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content, 'utf-8');
  }

  async readFile(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf-8');
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  // Backup operations
  async createBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(this.dataDir, 'backups');
    
    try {
      await fs.access(backupDir);
    } catch {
      await fs.mkdir(backupDir, { recursive: true });
    }

    const users = await this.readUsers();
    const blockchains = await this.readBlockchains();
    
    const backup = {
      timestamp,
      users,
      blockchains,
      version: '1.0.0'
    };

    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);
    await fs.writeFile(backupFile, JSON.stringify(backup, null, 2));
    
    return backupFile;
  }

  async restoreFromBackup(backupFile: string): Promise<boolean> {
    try {
      const backupData = JSON.parse(await fs.readFile(backupFile, 'utf-8'));
      
      if (backupData.users && backupData.blockchains) {
        await this.saveUsers(backupData.users);
        await this.saveBlockchains(backupData.blockchains);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
