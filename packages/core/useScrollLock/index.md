---
category: Sensors
---

# useScrollLock

Lock scrolling of the element. 

## Usage

```html
<script setup lang="ts">
import { useScrollLock } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const isLocked = useScrollLock(el)

isLocked.value = true // lock
isLocked.value = false // unlock
</script>

<template>
  <div ref="el"></div>
</template>
```
