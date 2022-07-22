---
category: '@Math'
---

# useRandomInteger

Get the random integer in an interval.

## Usage

```ts
import { useRandomInteger } from '@vueuse/math'

const min = ref(10)
const max = ref(100)

const integer = useRandomInteger(min, max) // Ref<number> value in [min, max]
```
