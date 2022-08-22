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
import type { UseMarkOptions } from '@vueuse/integrations/useMark'

const el = ref<HTMLElement | null>(null)
const search = ref('ipsum')
const options = ref<UseMarkOptions<false>>({
  acrossElements: true,
  separateWordSearch: false,
})

useMark(el, search, options)
</script>

<template>
  <div ref="el">
    lorem ipsum dolor sit amet
  </div>
</template>
```

Manual Mode

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useMark } from '@vueuse/integrations/useMark'
import type { UseMarkOptions } from '@vueuse/integrations/useMark'

const el = ref<HTMLElement | null>(null)
const search = ref('ipsum')
const options = ref<UseMarkOptions<false>>({
  acrossElements: true,
  separateWordSearch: false,
  manual: true
})

const { mark, unmark } = useMark(tbody, search, options)
</script>

<template>
  <button @click="mark()">
    mark
  </button>

  <button @click="unmark()">
    unmark
  </button>

  <div ref="el">
    lorem ipsum dolor sit amet
  </div>
</template>
```
