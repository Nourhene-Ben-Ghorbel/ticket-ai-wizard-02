
import { connectToMongoDB } from "@/api/mongodb";
import * as crypto from 'crypto';

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUserInput {
  username: string;
  email: string;
  password?: string; // Optionnel, sera généré si non fourni
  isAdmin?: boolean; // Optionnel, false par défaut
}

export interface UserOutput {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export const usersRepository = {
  // Générer un mot de passe aléatoire
  generatePassword(length = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  },

  // Hacher un mot de passe
  hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  },

  // Trouver un utilisateur par son email
  async findByEmail(email: string): Promise<User | null> {
    const mongo = await connectToMongoDB();
    try {
      const collection = mongo.db().collection('users');
      return await collection.findOne({ email }) as User | null;
    } finally {
      await mongo.close();
    }
  },

  // Trouver un utilisateur par son ID
  async findById(id: string): Promise<User | null> {
    const mongo = await connectToMongoDB();
    try {
      const collection = mongo.db().collection('users');
      return await collection.findOne({ _id: id }) as User | null;
    } finally {
      await mongo.close();
    }
  },

  // Lister tous les utilisateurs
  async findAll(): Promise<UserOutput[]> {
    const mongo = await connectToMongoDB();
    try {
      const collection = mongo.db().collection('users');
      const users = await collection.find().toArray() as User[];
      
      return users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toISOString()
      }));
    } finally {
      await mongo.close();
    }
  },

  // Créer un nouvel utilisateur
  async create(userData: NewUserInput): Promise<UserOutput> {
    const mongo = await connectToMongoDB();
    try {
      // Vérifier si l'utilisateur existe déjà
      const collection = mongo.db().collection('users');
      const existingUser = await collection.findOne({ email: userData.email });
      
      if (existingUser) {
        throw new Error(`Un utilisateur avec l'email ${userData.email} existe déjà`);
      }
      
      // Générer un mot de passe si non fourni
      const password = userData.password || this.generatePassword();
      const hashedPassword = this.hashPassword(password);
      
      const now = new Date();
      const newUser: User = {
        _id: `user_${Date.now()}`,
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        isAdmin: userData.isAdmin || false,
        createdAt: now,
        updatedAt: now
      };
      
      await collection.insertOne(newUser);
      
      return {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        createdAt: newUser.createdAt.toISOString()
      };
    } finally {
      await mongo.close();
    }
  },

  // Supprimer un utilisateur
  async delete(id: string): Promise<boolean> {
    const mongo = await connectToMongoDB();
    try {
      const collection = mongo.db().collection('users');
      const result = await collection.deleteOne({ _id: id });
      return result.deletedCount === 1;
    } finally {
      await mongo.close();
    }
  },

  // Mettre à jour un utilisateur
  async update(id: string, updates: Partial<Omit<User, '_id' | 'createdAt'>>): Promise<UserOutput | null> {
    const mongo = await connectToMongoDB();
    try {
      const collection = mongo.db().collection('users');
      
      // Si le mot de passe est fourni, le hacher
      if (updates.password) {
        updates.password = this.hashPassword(updates.password);
      }
      
      updates.updatedAt = new Date();
      
      const result = await collection.updateOne(
        { _id: id },
        { $set: updates }
      );
      
      if (result.matchedCount === 0) {
        return null;
      }
      
      const updatedUser = await collection.findOne({ _id: id }) as User;
      return {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt.toISOString()
      };
    } finally {
      await mongo.close();
    }
  }
};
