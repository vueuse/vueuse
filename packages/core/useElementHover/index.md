---
category: Sensors
---

# useElementHover

Reactive element's hover state.

## Usage

```vue
<template>
  <button ref="myHoverableElement">
    {{ isHovered }}
  </button>
</template>

<script setup>
import { useElementHover } from '@vueuse/core'

const myHoverableElement = ref()
const isHovered = useElementHover(myHoverableElement)
</script>
```
