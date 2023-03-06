---
category: '@Math'
---

# useClamp

Reactively clamp a value between two other values.

## Usage

```ts
import { useClamp } from '@vueuse/math'

const min = ref(0)
const max = ref(10)
const value = useClamp(0, min, max)
```

You can also pass a `ref` and the returned `computed` will be updated when the source ref changes:

```ts
import { useClamp } from '@vueuse/math'

const number = ref(0)
const clamped = useClamp(number, 0, 10)
```
