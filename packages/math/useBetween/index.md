---
category: '@Math'
---

# useBetween

Is the reactive value between the other two values

## Usage

```ts
import { useBetween } from '@vueuse/math'

const min = ref(0)
const max = ref(10)
const isBetween = useBetween(0, min, max)
```
