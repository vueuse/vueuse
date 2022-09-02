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

const { isCross } = useElementCross(elOne, elTwo)
</script>

<template>
  <div ref="elOne" />
  <div ref="elTwo" />
  <div>two element is cross: {{ isCross }}</div>
</template>
```



