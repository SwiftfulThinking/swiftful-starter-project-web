import { BaseManager } from './base-manager'
import { User } from '@/lib/models/user'
import { DocumentData, Timestamp, where } from 'firebase/firestore'

export class UserManager extends BaseManager<User> {
  constructor() {
    super('users')
  }

  protected toModel(id: string, data: DocumentData): User {
    return {
      id,
      email: data.email || '',
      displayName: data.displayName || null,
      photoURL: data.photoURL || null,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      role: data.role || 'user',
      isActive: data.isActive ?? true
    }
  }

  protected toFirestore(model: Partial<User>): DocumentData {
    const data: DocumentData = {}
    
    if (model.email !== undefined) data.email = model.email
    if (model.displayName !== undefined) data.displayName = model.displayName
    if (model.photoURL !== undefined) data.photoURL = model.photoURL
    if (model.role !== undefined) data.role = model.role
    if (model.isActive !== undefined) data.isActive = model.isActive
    
    // Always update the updatedAt timestamp
    data.updatedAt = Timestamp.now()
    
    // Set createdAt only if it's a new document
    if (model.createdAt) {
      data.createdAt = Timestamp.fromDate(model.createdAt)
    } else if (!model.id) {
      data.createdAt = Timestamp.now()
    }
    
    return data
  }

  /**
   * Get user by email
   */
  async getByEmail(email: string): Promise<User | null> {
    const users = await this.getAll(where('email', '==', email))
    return users.length > 0 ? users[0] : null
  }

  /**
   * Get all active users
   */
  async getActiveUsers(): Promise<User[]> {
    return this.getAll(where('isActive', '==', true))
  }

  /**
   * Create user from Firebase Auth user
   */
  async createFromAuth(authUser: {
    uid: string
    email: string | null
    displayName: string | null
    photoURL: string | null
  }): Promise<User> {
    const userData: Omit<User, 'id'> = {
      email: authUser.email || '',
      displayName: authUser.displayName,
      photoURL: authUser.photoURL,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'user',
      isActive: true
    }
    
    return this.create(userData, authUser.uid)
  }
}

// Export singleton instance
export const userManager = new UserManager()