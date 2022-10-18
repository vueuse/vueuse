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

```js
import { useIDBKeyval } from '@vueuse/integrations'

// bind object
const state = useStorage('my-store', { hello: 'hi', greeting: 'Hello' })

// bind boolean
const flag = useStorage('my-flag', true) // returns Ref<boolean>

// bind number
const count = useStorage('my-count', 0) // returns Ref<number>

// delete data from idb storage
state.value = null
```
