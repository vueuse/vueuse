---
category: '@Math'
---

# useRandomInt

Reactive `Math.random` for integers.

## Usage

```ts
import { useRandomInt } from '@vueuse/math'

const min = ref(1)
const max = ref(10)
const result = useRandomInt(min, max) // min <= result && result < max
```
