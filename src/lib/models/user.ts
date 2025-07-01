export interface User {
  id: string
  email: string
  displayName: string | null
  photoURL: string | null
  createdAt: Date
  updatedAt: Date
  role: 'user' | 'admin'
  isActive: boolean
}