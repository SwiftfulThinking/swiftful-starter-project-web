import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { userManager } from './user-manager'
import { User } from '@/lib/models/user'

export class AuthManager {
  private googleProvider = new GoogleAuthProvider()

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, displayName?: string): Promise<User> {
    try {
      // Create auth user
      const { user: authUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name if provided
      if (displayName) {
        await updateProfile(authUser, { displayName })
      }
      
      // Send verification email
      await sendEmailVerification(authUser)
      
      // Create user in Firestore
      const user = await userManager.createFromAuth({
        uid: authUser.uid,
        email: authUser.email,
        displayName: displayName || authUser.displayName,
        photoURL: authUser.photoURL
      })
      
      return user
    } catch (error: any) {
      console.error('Error signing up:', error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<User> {
    try {
      const { user: authUser } = await signInWithEmailAndPassword(auth, email, password)
      
      // Get or create user in Firestore
      let user = await userManager.getById(authUser.uid)
      
      if (!user) {
        user = await userManager.createFromAuth({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL
        })
      }
      
      return user
    } catch (error: any) {
      console.error('Error signing in:', error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<User> {
    try {
      const { user: authUser } = await signInWithPopup(auth, this.googleProvider)
      
      // Get or create user in Firestore
      let user = await userManager.getById(authUser.uid)
      
      if (!user) {
        user = await userManager.createFromAuth({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL
        })
      }
      
      return user
    } catch (error: any) {
      console.error('Error signing in with Google:', error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error: any) {
      console.error('Error signing out:', error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      console.error('Error sending password reset:', error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Get current auth user
   */
  getCurrentAuthUser(): FirebaseUser | null {
    return auth.currentUser
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const user = await userManager.getById(authUser.uid)
        callback(user)
      } else {
        callback(null)
      }
    })
  }

  /**
   * Handle auth errors with user-friendly messages
   */
  private handleAuthError(error: any): Error {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/operation-not-allowed': 'Operation not allowed.',
      'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/popup-closed-by-user': 'Sign in was cancelled.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
    }

    const message = errorMessages[error.code] || error.message || 'An error occurred during authentication.'
    return new Error(message)
  }
}

// Export singleton instance
export const authManager = new AuthManager()