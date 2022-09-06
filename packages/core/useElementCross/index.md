---
category: Elements
---

# useElementCross

Reactive two element whether cross state.

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useElementCross } from '@vueuse/core'

const elOne = ref<HTMLDivElement>()
const elTwo = ref<HTMLDivElement>()

const { isCross, update } = useElementCross(elOne, elTwo)
</script>

<template>
  <div>
    two element is cross: {{ isCross }}
  </div>
  <div ref="elOne">
    one
  </div>
  <div ref="elTwo">
    two
  </div>
</template>
```
