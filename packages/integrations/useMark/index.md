---
category: '@Integrations'
---

# useMark

Wrapper for [`mark.js`](https://markjs.io/)

## Install

```bash
npm install mark.js
```

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useMark } from '@vueuse/integrations/useMark'

const el = ref<HTMLElement | null>(null)
const search = ref('ipsum')

useMark(el, search)
</script>

<template>
  <div ref="el">
    lorem ipsum dolor sit amet
  </div>
</template>
```
