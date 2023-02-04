---
category: Browser
---

# useDebounceValue

Reactive debounce value use full to bind search box or input to make api call on value change.


## Basic Usage

```js
import { useDebounceValue } from '@vueuse/core'
import { ref } from 'vue'

const searchQuery = ref('')
const debounceValue = useDebounceValue(searchQuery, 200)
```

## Behavior

`useDebounceValue` takes in 2 argument. The first argument is a ref object (only the one which extends string type) and the second argument is delay in milliseconds. The returned value of this composable is a debounced value.


You can also use it with TypeScript

```ts
import { useDebounceValue } from '@vueuse/core'
import { ref } from 'vue'

const searchQuery = ref<string>('')
const debounceValue = useDebounceValue(searchQuery, 200)
```





