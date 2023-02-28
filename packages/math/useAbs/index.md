---
category: '@Math'
---

# useAbs

Reactive `Math.abs`.

## Usage

```ts
import { useAbs } from '@vueuse/math'

const value = ref(-23)
const absValue = useAbs(value) // Ref<23>
```
