import { 
  signInWithPopup,
  signInAnonymously,
  signOut,
  deleteUser,
  GoogleAuthProvider,
  User as FirebaseUser,
  onAuthStateChanged,
  linkWithPopup,
  AuthError
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, deleteDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isAnonymous: boolean
}

class AuthManager {
  private googleProvider = new GoogleAuthProvider()
  private currentUser: AuthUser | null = null
  private authStateListeners: ((user: AuthUser | null) => void)[] = []

  constructor() {
    // Set up Google provider
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    })

    // Listen to auth state changes
    onAuthStateChanged(auth, (firebaseUser) => {
      this.currentUser = firebaseUser ? this.mapFirebaseUser(firebaseUser) : null
      this.notifyListeners()
    })
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): AuthUser | null {
    return this.currentUser
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<AuthUser> {
    try {
      let firebaseUser: FirebaseUser
      
      // If user is anonymous, try to link accounts
      if (auth.currentUser?.isAnonymous) {
        const result = await linkWithPopup(auth.currentUser, this.googleProvider)
        firebaseUser = result.user
      } else {
        // Otherwise, sign in normally
        const result = await signInWithPopup(auth, this.googleProvider)
        firebaseUser = result.user
      }
      
      // Check if this is a new user (first time sign in)
      await this.createUserProfileIfNeeded(firebaseUser)
      
      return this.mapFirebaseUser(firebaseUser)
    } catch (error) {
      throw this.handleAuthError(error as AuthError)
    }
  }

  /**
   * Sign in anonymously
   */
  async signInAnonymously(): Promise<AuthUser> {
    try {
      const result = await signInAnonymously(auth)
      return this.mapFirebaseUser(result.user)
    } catch (error) {
      throw this.handleAuthError(error as AuthError)
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      throw this.handleAuthError(error as AuthError)
    }
  }

  /**
   * Delete current user account
   */
  async deleteAccount(): Promise<void> {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('No user is currently signed in')
      }

      // Delete user data from Firestore
      try {
        await deleteDoc(doc(db, 'users', user.uid))
      } catch (error) {
        console.error('Error deleting user data:', error)
      }

      // Delete the auth account
      await deleteUser(user)
    } catch (error) {
      throw this.handleAuthError(error as AuthError)
    }
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    this.authStateListeners.push(callback)
    
    // Immediately call with current state
    callback(this.currentUser)
    
    // Return unsubscribe function
    return () => {
      this.authStateListeners = this.authStateListeners.filter(listener => listener !== callback)
    }
  }

  /**
   * Create user profile in Firestore if it doesn't exist
   */
  private async createUserProfileIfNeeded(firebaseUser: FirebaseUser): Promise<void> {
    const userRef = doc(db, 'users', firebaseUser.uid)
    const userSnap = await getDoc(userRef)
    
    // If user doesn't exist in Firestore, create their profile
    if (!userSnap.exists()) {
      const userData = {
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || null,
        photoURL: firebaseUser.photoURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        role: 'user',
        isActive: true
      }
      
      await setDoc(userRef, userData)
    }
  }

  /**
   * Map Firebase user to our AuthUser interface
   */
  private mapFirebaseUser(firebaseUser: FirebaseUser): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      isAnonymous: firebaseUser.isAnonymous
    }
  }

  /**
   * Notify all auth state listeners
   */
  private notifyListeners(): void {
    this.authStateListeners.forEach(listener => listener(this.currentUser))
  }

  /**
   * Handle auth errors with user-friendly messages
   */
  private handleAuthError(error: AuthError): Error {
    const errorMessages: Record<string, string> = {
      'auth/popup-closed-by-user': 'Sign in was cancelled',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/user-disabled': 'This account has been disabled',
      'auth/operation-not-allowed': 'This operation is not allowed',
      'auth/popup-blocked': 'Popup was blocked. Please allow popups for this site',
      'auth/requires-recent-login': 'Please sign in again to complete this action',
      'auth/credential-already-in-use': 'This account is already in use',
    }

    const message = errorMessages[error.code] || error.message || 'An error occurred during authentication'
    return new Error(message)
  }
}

// Export singleton instance
export const authManager = new AuthManager()