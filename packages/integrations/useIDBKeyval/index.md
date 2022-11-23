---
category: '@Integrations'
---

# useIDBKeyval

Wrapper for [`idb-keyval`](https://www.npmjs.com/package/idb-keyval).


## Install idb-keyval as a peer dependency

```bash
npm install idb-keyval
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

// delete data from idb storage
storedObject.value = null
```
