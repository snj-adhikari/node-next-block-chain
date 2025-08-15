import { User, UserModel } from '../models/User';
import { FileService } from './FileService';
import path from 'path';

export class UserService {
  private fileService: FileService;
  private usersFilePath: string;

  constructor() {
    this.fileService = new FileService();
    this.usersFilePath = path.join(process.cwd(), 'backend', 'data', 'users.json');
  }

  async createUser(userData: {
    email: string;
    name: string;
    image?: string;
    provider: 'google' | 'facebook';
    googleId?: string;
  }): Promise<User> {
    console.log('👤 Creating new user:', userData.email);
    
    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        console.log('✅ User already exists, returning existing user');
        return existingUser;
      }

      // Create new user
      const newUser = UserModel.createUser(userData);
      
      // Load existing users
      const users = await this.getAllUsers();
      
      // Add new user
      users.push(newUser);
      
      // Save to file
      await this.fileService.writeFile(this.usersFilePath, JSON.stringify(users, null, 2));
      
      console.log('✅ User created successfully with ID:', newUser.id);
      return newUser;
    } catch (error) {
      console.error('❌ Failed to create user:', error);
      throw error;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.id === userId) || null;
    } catch (error) {
      console.error('❌ Failed to get user by ID:', error);
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.email === email) || null;
    } catch (error) {
      console.error('❌ Failed to get user by email:', error);
      return null;
    }
  }

  async getUserByGoogleId(googleId: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(user => user.googleId === googleId) || null;
    } catch (error) {
      console.error('❌ Failed to get user by Google ID:', error);
      return null;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        console.log('❌ User not found for update:', userId);
        return null;
      }

      const updatedUser = UserModel.updateUser(users[userIndex], updates);
      users[userIndex] = updatedUser;
      
      await this.fileService.writeFile(this.usersFilePath, JSON.stringify(users, null, 2));
      
      console.log('✅ User updated successfully:', userId);
      return updatedUser;
    } catch (error) {
      console.error('❌ Failed to update user:', error);
      return null;
    }
  }

  async addBlockchainToUser(userId: string, blockchainId: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        console.log('❌ User not found for blockchain addition:', userId);
        return null;
      }

      const updatedUser = UserModel.addBlockchainToUser(users[userIndex], blockchainId);
      users[userIndex] = updatedUser;
      
      await this.fileService.writeFile(this.usersFilePath, JSON.stringify(users, null, 2));
      
      console.log('✅ Blockchain added to user:', blockchainId, 'for user:', userId);
      return updatedUser;
    } catch (error) {
      console.error('❌ Failed to add blockchain to user:', error);
      return null;
    }
  }

  async removeBlockchainFromUser(userId: string, blockchainId: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === userId);
      
      if (userIndex === -1) {
        console.log('❌ User not found for blockchain removal:', userId);
        return null;
      }

      const updatedUser = UserModel.removeBlockchainFromUser(users[userIndex], blockchainId);
      users[userIndex] = updatedUser;
      
      await this.fileService.writeFile(this.usersFilePath, JSON.stringify(users, null, 2));
      
      console.log('✅ Blockchain removed from user:', blockchainId, 'for user:', userId);
      return updatedUser;
    } catch (error) {
      console.error('❌ Failed to remove blockchain from user:', error);
      return null;
    }
  }

  async getUserBlockchains(userId: string): Promise<string[]> {
    try {
      const user = await this.getUserById(userId);
      return user?.blockchains || [];
    } catch (error) {
      console.error('❌ Failed to get user blockchains:', error);
      return [];
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const users = await this.getAllUsers();
      const filteredUsers = users.filter(user => user.id !== userId);
      
      if (users.length === filteredUsers.length) {
        console.log('❌ User not found for deletion:', userId);
        return false;
      }
      
      await this.fileService.writeFile(this.usersFilePath, JSON.stringify(filteredUsers, null, 2));
      
      console.log('✅ User deleted successfully:', userId);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete user:', error);
      return false;
    }
  }

  private async getAllUsers(): Promise<User[]> {
    try {
      const fileExists = await this.fileService.fileExists(this.usersFilePath);
      if (!fileExists) {
        return [];
      }
      
      const data = await this.fileService.readFile(this.usersFilePath);
      return JSON.parse(data) as User[];
    } catch (error) {
      console.error('❌ Failed to load users:', error);
      return [];
    }
  }
}