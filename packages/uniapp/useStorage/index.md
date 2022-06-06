---
category: State
---

# useStorage

Reactive [uniapp storage](https://uniapp.dcloud.io/api/storage/storage.html#setstorage)

## Usage

```js
import { useStorage } from '@vueuse/uniapp'

// bind object
const state = useStorage(uni, 'my-store', { hello: 'hi', greeting: 'Hello' })

// bind boolean
const flag = useStorage(uni, 'my-flag', true) // returns Ref<boolean>

// bind number
const count = useStorage(uni, 'my-count', 0) // returns Ref<number>

// delete data from storage
state.value = null
```

## More Options

Please refer to `useStorage`
