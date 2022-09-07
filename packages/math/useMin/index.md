---
category: '@Math'
---

# useMin

Reactive `Math.min`.

## Usage

```ts
import { useMin } from '@vueuse/math'

const array = ref([1, 2, 3, 4])
const sum = useMin(array) // Ref<1>
```

```ts
import { useMin } from '@vueuse/math'

const a = ref(1)
const b = ref(3)

const sum = useMin(a, b, 2) // Ref<1>
```
