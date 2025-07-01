import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  QueryConstraint,
  DocumentData,
  WithFieldValue,
  UpdateData,
  CollectionReference,
  DocumentReference
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * Base Manager class that provides common Firebase operations
 * All managers should extend this class
 */
export abstract class BaseManager<T extends { id: string }> {
  protected collectionName: string

  constructor(collectionName: string) {
    this.collectionName = collectionName
  }

  /**
   * Get collection reference
   */
  protected getCollection(): CollectionReference {
    return collection(db, this.collectionName)
  }

  /**
   * Get document reference
   */
  protected getDocRef(id: string): DocumentReference {
    return doc(db, this.collectionName, id)
  }

  /**
   * Abstract method to convert Firestore data to model
   */
  protected abstract toModel(id: string, data: DocumentData): T

  /**
   * Abstract method to convert model to Firestore data
   */
  protected abstract toFirestore(model: Partial<T>): WithFieldValue<DocumentData>

  /**
   * Create a new document
   */
  async create(data: Omit<T, 'id'>, customId?: string): Promise<T> {
    try {
      const id = customId || doc(this.getCollection()).id
      const firestoreData = this.toFirestore({ ...data, id } as Partial<T>)
      
      await setDoc(this.getDocRef(id), firestoreData)
      
      return this.toModel(id, firestoreData)
    } catch (error) {
      console.error(`Error creating ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Get a document by ID
   */
  async getById(id: string): Promise<T | null> {
    try {
      const docSnap = await getDoc(this.getDocRef(id))
      
      if (!docSnap.exists()) {
        return null
      }
      
      return this.toModel(docSnap.id, docSnap.data())
    } catch (error) {
      console.error(`Error getting ${this.collectionName} by ID:`, error)
      throw error
    }
  }

  /**
   * Get all documents with optional query constraints
   */
  async getAll(...constraints: QueryConstraint[]): Promise<T[]> {
    try {
      const q = constraints.length > 0 
        ? query(this.getCollection(), ...constraints)
        : this.getCollection()
        
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => 
        this.toModel(doc.id, doc.data())
      )
    } catch (error) {
      console.error(`Error getting all ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Update a document
   */
  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      const updateData = this.toFirestore(data) as UpdateData<DocumentData>
      await updateDoc(this.getDocRef(id), updateData)
    } catch (error) {
      console.error(`Error updating ${this.collectionName}:`, error)
      throw error
    }
  }

  /**
   * Delete a document
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(this.getDocRef(id))
    } catch (error) {
      console.error(`Error deleting ${this.collectionName}:`, error)
      throw error
    }
  }
}