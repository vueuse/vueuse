import { shallowRef, toRaw } from 'vue'

interface UseIndexedDB<T> {
  saveRecord: (data: T) => Promise<string>
  getRecord: (key: IDBValidKey) => Promise<T | undefined>
  getAllRecords: () => Promise<T[]>
  deleteRecord: (key: IDBValidKey) => Promise<string>
}

export function useIndexedDB<T>(dbName: string, storeName: string, keyPath: string): UseIndexedDB<T> {
  const db = shallowRef<IDBDatabase | null>(null)

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
