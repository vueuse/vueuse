---
category: Watch
---

# watchDeep

Shorthand for watching value with {deep: true}

## Usage

Similar to `watch`, but with `{ deep: true }`

```ts
import { watchDeep } from '@vueuse/core'

const nestedObject = ref({ foo: { bar: { deep: 5 } } })

watchDeep(nestedObject, (obj) => {
  console.log(updated)
})

onMounted(() => {
  nestedObject.value.foo.bar.deep = 10
})
```
