---
category: Watch
---

# watchClone

Watch an object and return the isolated new and old values.

## Usage

Similar to `watch`, but offering extra options `clone` to provide a cloned old value while keeping the new value isolated when watching an object.

```ts
import { watchClone } from '@vueuse/core'

const obj = ref({ a: 1, b: {
  c: 3
} }, {
  deep: true
})

watch(obj, (newVal, oldVal) => {
  console.log(newVal) // { a: 1, b: { c: 100 } }
  console.log(oldVal) // { a: 1, b: { c: 3 } }
}, {
  deep: true
})

onMounted(() => {
  obj.value.b.c = 100
})
```
