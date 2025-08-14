export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: 'google' | 'facebook';
  createdAt: string;
  updatedAt: string;
  blockchains: string[]; // Array of blockchain IDs owned by user
  settings?: {
    emailNotifications: boolean;
    publicProfile: boolean;
  };
}

export interface UserSession {
  user: User;
  token: string;
  expiresAt: string;
}

export class UserModel {
  static createUser(userData: {
    email: string;
    name: string;
    image?: string;
    provider: 'google' | 'facebook';
  }): User {
    return {
      id: this.generateId(),
      email: userData.email,
      name: userData.name,
      image: userData.image,
      provider: userData.provider,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blockchains: [],
      settings: {
        emailNotifications: true,
        publicProfile: false,
      },
    };
  }

  static updateUser(user: User, updates: Partial<User>): User {
    return {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
  }

  static addBlockchainToUser(user: User, blockchainId: string): User {
    if (!user.blockchains.includes(blockchainId)) {
      user.blockchains.push(blockchainId);
      user.updatedAt = new Date().toISOString();
    }
    return user;
  }

  static removeBlockchainFromUser(user: User, blockchainId: string): User {
    user.blockchains = user.blockchains.filter(id => id !== blockchainId);
    user.updatedAt = new Date().toISOString();
    return user;
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  static validateUser(user: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!user.email || typeof user.email !== 'string' || !user.email.includes('@')) {
      errors.push('Valid email is required');
    }

    if (!user.name || typeof user.name !== 'string' || user.name.trim().length < 1) {
      errors.push('Name is required');
    }

    if (!user.provider || !['google', 'facebook'].includes(user.provider)) {
      errors.push('Valid provider is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
