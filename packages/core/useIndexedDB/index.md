---
category: State
related: useLocalStorage, useSessionStorage, useStorageAsync
---

# useIndexedDB

Vue composable for IndexedDB operations with TypeScript support.[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## 📖 Description

`useIndexedDB` provides a convenient way to interact with IndexedDB databases in Vue applications. It offers type-safe methods for common database operations like saving, retrieving, and deleting records.

## 🦄 Usage

```typescript
import { useIndexedDB } from '@vueuse/core'

interface User {
  id: number
  name: string
  email: string
}

// Initialize the database
const db = useIndexedDB<User>('myDatabase', 'users', 'id')

// Save a record
await db.saveRecord({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
})

// Get a record by key
const user = await db.getRecord(1)

// Get all records
const allUsers = await db.getAllRecords()

// Delete a record
await db.deleteRecord(1)
```

## 🎭 Type Parameters

| Name | Type  | Description                                   |
| ---- | ----- | --------------------------------------------- |
| `T`  | `any` | Type of the data to be stored in the database |

## 📑 Parameters

| Name        | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| `dbName`    | `string` | Name of the IndexedDB database |
| `storeName` | `string` | Name of the object store       |
| `keyPath`   | `string` | Key path for the object store  |

## 🔄 Returns

Object with the following methods:

| Method          | Type                                            | Description                    |
| --------------- | ----------------------------------------------- | ------------------------------ |
| `saveRecord`    | `(data: T) => Promise<string>`                  | Saves a record to the database |
| `getRecord`     | `(key: IDBValidKey) => Promise<T \| undefined>` | Retrieves a record by key      |
| `getAllRecords` | `() => Promise<T[]>`                            | Retrieves all records          |
| `deleteRecord`  | `(key: IDBValidKey) => Promise<string>`         | Deletes a record by key        |

## 🧩 Example

```vue
<script setup lang="ts">
import { useIndexedDB } from '@vueuse/core'

interface Todo {
  id: number
  title: string
  completed: boolean
}

const db = useIndexedDB<Todo>('todos-app', 'todos', 'id')

// Add a todo
await db.saveRecord({
  id: Date.now(),
  title: 'Learn Vue',
  completed: false
})

// Get all todos
const todos = await db.getAllRecords()
</script>
```

## 🌐 Browser Compatibility

This composable requires browser support for IndexedDB. Check [Can I Use](https://caniuse.com/indexeddb) for browser compatibility.

## 📝 Notes

- Ensure your data is serializable before saving to IndexedDB
- All operations return Promises and should be properly handled
- The database and object store are created automatically if they don't exist
- Uses version 1 of the database by default
