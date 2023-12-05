---
category: Sensors
---

# useSwipe

Reactive swipe detection based on [`TouchEvents`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent).

## Usage

```vue
<script setup>
const el = ref(null)
const { isSwiping, direction } = useSwipe(el)
</script>

<template>
  <div ref="el">
    Swipe here
  </div>
</template>
```
