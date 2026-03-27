---
category: '@Integrations'
---

# useIDBKeyval

Wrapper for [`idb-keyval`](https://www.npmjs.com/package/idb-keyval).

## Install idb-keyval as a peer dependency

```bash
npm install idb-keyval@^6
```

## Usage

```ts
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval'

// bind object
const { data: storedObject, isFinished } = useIDBKeyval('my-idb-keyval-store', { hello: 'hi', greeting: 'Hello' })

// update object
storedObject.value.hello = 'hola'

// bind boolean
const flag = useIDBKeyval('my-flag', true) // returns Ref<boolean>

// bind number
const count = useIDBKeyval('my-count', 0) // returns Ref<number>

// awaiting IDB transaction
await count.set(10)
console.log('IDB transaction finished!')

// delete data from idb storage
storedObject.value = null
```

## Cross-tab syncing

Changes are automatically synced across browser tabs using the [`BroadcastChannel` API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel). This is enabled by default and can be disabled via the `listenToStorageChanges` option.

```ts
// disable cross-tab syncing
const { data } = useIDBKeyval('my-key', 'default', { listenToStorageChanges: false })
```
