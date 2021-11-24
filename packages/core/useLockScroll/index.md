---
category: Sensors
---

# useLockScroll

Lock scrolling of the element. 

## Usage

```html
<script setup lang="ts">
import { useLockScroll } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { lockState, lock, unlock } = useLockScroll(el)
</script>

<template>
  <div ref="el"></div>
</template>
```
