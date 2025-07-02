import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage'
import { storage } from '@/lib/firebase'

/**
 * Manager class for Firebase Storage operations
 */
class StorageManager {
  /**
   * Upload a File object to Firebase Storage and return the download URL
   * @param path - Path inside the Firebase Storage bucket
   * @param file - A File object (e.g., from file input)
   * @returns The download URL of the uploaded file
   */
  async uploadFile(path: string, file: File): Promise<string> {
    try {
      const fileRef = ref(storage, path)
      await uploadBytes(fileRef, file)
      return await getDownloadURL(fileRef)
    } catch (error) {
      console.error('Error uploading file:', error)
      throw new Error('Failed to upload file')
    }
  }

  /**
   * Get the download URL for a file in Firebase Storage
   * @param path - Path to the file in Firebase Storage
   * @returns The download URL
   */
  async getFileUrl(path: string): Promise<string> {
    try {
      const fileRef = ref(storage, path)
      return await getDownloadURL(fileRef)
    } catch (error) {
      console.error('Error getting file URL:', error)
      throw new Error('Failed to get file URL')
    }
  }

  /**
   * Delete a file from Firebase Storage
   * @param path - Path to the file in Firebase Storage
   */
  async deleteFile(path: string): Promise<void> {
    try {
      const fileRef = ref(storage, path)
      await deleteObject(fileRef)
    } catch (error) {
      console.error('Error deleting file:', error)
      throw new Error('Failed to delete file')
    }
  }

  /**
   * List all files in a directory
   * @param path - Path to the directory in Firebase Storage
   * @returns Array of file paths
   */
  async listFiles(path: string): Promise<string[]> {
    try {
      const directoryRef = ref(storage, path)
      const result = await listAll(directoryRef)
      return result.items.map(item => item.fullPath)
    } catch (error) {
      console.error('Error listing files:', error)
      throw new Error('Failed to list files')
    }
  }

  /**
   * Upload multiple files to Firebase Storage
   * @param basePath - Base path in Firebase Storage
   * @param files - Array of File objects
   * @returns Array of download URLs
   */
  async uploadMultipleFiles(basePath: string, files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map((file, index) => {
        const path = `${basePath}/${Date.now()}_${index}_${file.name}`
        return this.uploadFile(path, file)
      })
      return await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Error uploading multiple files:', error)
      throw new Error('Failed to upload multiple files')
    }
  }

  /**
   * Generate a unique file path with timestamp
   * @param basePath - Base path in Firebase Storage
   * @param fileName - Original file name
   * @returns Unique file path
   */
  generateUniquePath(basePath: string, fileName: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = fileName.split('.').pop() || ''
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, '')
    return `${basePath}/${timestamp}_${randomString}_${nameWithoutExtension}.${extension}`
  }
}

export const storageManager = new StorageManager()