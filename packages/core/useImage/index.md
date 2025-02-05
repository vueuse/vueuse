---
category: Browser
---

# useImage

Reactive load an image in the browser, you can wait the result to display it or show a fallback.

## Usage

```vue
<script setup lang="ts">
import { useImage } from '@vueuse/core'

const avatarUrl = 'https://place.dog/300/200'
const { isLoading } = useImage({ src: avatarUrl })
</script>

<template>
  <span v-if="isLoading">Loading</span>
  <img v-else :src="avatarUrl">
</template>
```

## Component Usage

```vue
<template>
  <UseImage src="https://place.dog/300/200">
    <template #loading>
      Loading..
    </template>

    <template #error>
      Failed
    </template>
  </UseImage>
</template>
```
