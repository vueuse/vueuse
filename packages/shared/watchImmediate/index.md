---
category: Watch
---

# watchImmediate

Shorthand for watching value with {immediate: true}

## Usage

Similar to `watch`, but with `{ immediate: true }`

```ts
import { watchImmediate } from '@vueuse/core'

const obj = ref('vue-use')

// changing the value from some external store/composables
obj.value = 'VueUse'

watchImmediate(nestedObject, (obj) => {
  console.log(updated) // Console.log will be logged twice
})
```
