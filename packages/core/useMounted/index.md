---
category: Component
---

# useMounted

Mounted state in ref.

## Usage

```js
import { useMounted } from '@vueuse/core'

const { isMounted, mounted } = useMounted()
```

Which is essentially a shorthand of:

```ts
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

function mounted() {
  return new Promise((resolve) => {
    if (isMounted.value)
      resolve()
    else
      onMounted(resolve)
  })
}
```
