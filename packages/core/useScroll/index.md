---
category: Sensors
---

# useScroll

Reactive scroll position and state

## Usage

```html {16-20}
<template>
  <ul ref="scrollRef"">
  </ul>
</template>

<script setup>
	import { useScroll } from '@vueuse/core'
	
	const scrollRef = ref<HTMLElement | null>(null)
	
	const { x, y, scrolling, finished, arrivedStatus } = useScroll(scrollRef)
</script>
```
