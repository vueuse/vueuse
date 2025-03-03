import { shallowRef, toRaw } from 'vue'

/**
 * Interface defining the operations available for IndexedDB interactions
 * @template T - The type of data to be stored in the database
 */
interface UseIndexedDB<T> {
  saveRecord: (data: T) => Promise<string>
  getRecord: (key: IDBValidKey) => Promise<T | undefined>
  getAllRecords: () => Promise<T[]>
  deleteRecord: (key: IDBValidKey) => Promise<string>
}

/**
 * Vue composable for IndexedDB operations
 * @template T - The type of data to be stored in the database
 * @param dbName - Name of the IndexedDB database
 * @param storeName - Name of the object store
 * @param keyPath - Key path for the object store
 * @returns Object containing methods for IndexedDB operations
 */
export function useIndexedDB<T>(dbName: string, storeName: string, keyPath: string): UseIndexedDB<T> {
  const db = shallowRef<IDBDatabase | null>(null)

  /**
   * Opens the IndexedDB database and creates object store if needed
   * @returns Promise resolving to IDBDatabase instance
   */
  const openDatabase = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1)

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const database = (event.target as IDBOpenDBRequest).result
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath })
        }
      }

      request.onsuccess = (event: Event) => {
        db.value = (event.target as IDBOpenDBRequest).result
        resolve(db.value)
      }

      request.onerror = (event: Event) => reject((event.target as IDBOpenDBRequest).error)
    })
  }

  /**
   * Saves a record to the database
   * @param data - The data to be saved
   * @returns Promise resolving to success message
   */
  const saveRecord = async (data: T): Promise<string> => {
    if (!db.value)
      await openDatabase()
    const safeData = toRaw(data) // Ensure it's serializable
    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      store.put(safeData)
      transaction.oncomplete = () => resolve('Saved successfully!')
      transaction.onerror = event => reject((event.target as IDBRequest).error)
    })
  }

  /**
   * Retrieves a single record by its key
   * @param key - The key of the record to retrieve
   * @returns Promise resolving to the record or undefined if not found
   */
  const getRecord = async (key: IDBValidKey): Promise<T | undefined> => {
    if (!db.value)
      await openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)
      request.onsuccess = () => resolve(request.result as T | undefined)
      request.onerror = event => reject((event.target as IDBRequest).error)
    })
  }

  /**
   * Retrieves all records from the object store
   * @returns Promise resolving to an array of all records
   */
  const getAllRecords = async (): Promise<T[]> => {
    if (!db.value)
      await openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result as T[])
      request.onerror = event => reject((event.target as IDBRequest).error)
    })
  }

  /**
   * Deletes a record by its key
   * @param key - The key of the record to delete
   * @returns Promise resolving to success message
   */
  const deleteRecord = async (key: IDBValidKey): Promise<string> => {
    if (!db.value)
      await openDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      store.delete(key)
      transaction.oncomplete = () => resolve('Deleted successfully!')
      transaction.onerror = event => reject((event.target as IDBRequest).error)
    })
  }

  return {
    saveRecord,
    getRecord,
    getAllRecords,
    deleteRecord,
  }
}
