---
category: Animation
---

# useRafFn

Call function on every `requestAnimationFrame`. With controls of pausing and resuming.

## Usage

```ts
import { useRafFn } from '@vueuse/core'
import { shallowRef } from 'vue'

const count = shallowRef(0)

const { pause, resume } = useRafFn(() => {
  count.value++
  console.log(count.value)
})
```
