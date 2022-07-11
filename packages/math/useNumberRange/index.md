---
category: Utilities
---

# useNumberRange

Basic sliding window with utility functions.

## Usage

```ts
import { useNumberRange } from '@vueuse/core'
import { computed, ref } from 'vue-demi'

const start = ref(0)
const size = ref(10)
const end = computed(() => start.value + size.value)
const min = ref(0)
const max = ref(100)

const range = useNumberRange(
  min,
  max,
  start,
  end,
)

const rangeStart = computed(() => range.value[0])
const rangeEnd = computed(() => range.value[1])
```
