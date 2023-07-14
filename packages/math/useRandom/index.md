---
category: '@Math'
---

# useRandom

Reactive `Math.random`.

## Usage

```ts
import { useRandom } from '@vueuse/math'

const min = ref(1)
const max = ref(10)
const result = useRandom(min, max) // min <= result && result < max
```
