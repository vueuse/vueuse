---
category: '@Math'
---

# useMath

Use Math reactively

## Usage

```ts
import { useMath } from '@vueuse/math'

const value = ref(45.95)
const { round, floor } = useMath()
const rounded = round(value)
// rounded.value is 46
const floored = floor(value)
// floored.value is 45
```
