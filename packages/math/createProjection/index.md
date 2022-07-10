---
category: '@Math'
related: useProjection, createGenericProjection
---

# createProjection

Reactive numeric projection from one domain to another.

## Usage

```ts
import { createProjection } from '@vueuse/math'

const useProjector = createProjection([0, 10], [0, 100])
const input = ref(0)
const projected = useProjector(input) // projected.value === 0

input.value = 5 // projected.value === 50
input.value = 10 // projected.value === 100
```
