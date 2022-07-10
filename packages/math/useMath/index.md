---
category: '@Math'
---

# useMath

Use Math reactively

## Usage

```ts
import { useMath } from '@vueuse/math'

const value = ref(45.95)
const rounded = useMath('round', value)
// rounded.value is 46
const floored = useMath('floor', value)
// floored.value is 45
```
