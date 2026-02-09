---
category: Component
---

# useMounted

Mounted state in ref.

## Usage

```ts
import { useMounted } from '@vueuse/core'

const isMounted = useMounted()
```

Which is essentially a shorthand of:

```ts
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
```

### Awaitable

The return value of `useMounted` is also a `PromiseLike`, so you can `await` it to wait until the component is mounted:

```ts
import { useMounted } from '@vueuse/core'

const isMounted = useMounted()

async function doSomething() {
  await isMounted
  // Component is now mounted, safe to access DOM etc.
}
```
