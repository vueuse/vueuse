---
category: '@Math'
---

# useProjection

Basic projection and co-projection with utility functions.

## Usage

```ts
import { useProjection } from '@vueuse/math'

const domainStart = ref(0)
const domainEnd = ref(10)
const valueStart = ref(0)
const valueEnd = ref(100)

const [useProjector] = useProjection(domainStart, domainEnd, valueStart, valueEnd)
const domain = ref(0)
const value = useProjector(domain) // value.value === 0

domain.value = 5 // value.value === 50
domain.value = 10 // value.value === 100
```
