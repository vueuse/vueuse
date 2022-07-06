---
category: Browser
---

# useTextareaAutosize

Automatically update the height of a textarea element depending on its content.

## Usage

```vue
<script setup lang="ts">
const { textarea, input } = useTextareaAutosize()
</script>

<template>
  <textarea
    ref="textarea"
    v-model="input"
    class="resize-none"
    placeholder="What's on your mind?"
  />
</template>
```
