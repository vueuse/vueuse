---
category: Watch
---

# watchDeepImmediate

Shorthand for watching value with {deep: true, immediate: true}

## Usage

Similar to `watch`, but with `{ deep: true, immediate: true }`

```ts
import { watchDeepImmediate } from '@vueuse/core'

const nestedObject = ref({ foo: { bar: { deep: 5 } } })

watchDeepImmediate(nestedObject, (obj) => {
  console.log(updated)
})

onMounted(() => {
  nestedObject.value.foo.bar.deep = 10
})
```
