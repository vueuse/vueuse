---
category: Watch
---

# watchClone

Watch an object and return the isolated new and old values.

## Usage

Similar to `watch`, because `watchClone` uses the `useCloned` implementation provided by `vueuse`, it supports watch options and useCloned options as `watchOptions` and `useClonedOptions`

```ts
import { watchClone } from '@vueuse/core'

const obj = ref({ a: 1, b: {
  c: 3
} })

watch(obj, (newVal, oldVal) => {
  console.log(newVal) // { a: 1, b: { c: 100 } }
  console.log(oldVal) // { a: 1, b: { c: 3 } }
}, {
  watchOptions: {},
  useClonedOptions: {}
})

onMounted(() => {
  obj.value.b.c = 100
})
```
