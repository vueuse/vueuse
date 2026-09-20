---
category: Elements
---

# useElementOverflow

Reactive element's overflow state.

## Usage

```vue
<script setup>
import { useElementOverflow } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { isXOverflowed } = useElementOverflow(el)
</script>

<template>
  <div ref="el" style="width: 100px;overflow: hidden;">
    <button v-if="isXOverflowed">
      show more
    </button>
    <span v-else>some words may be too long to show here</span>
  </div>
</template>
```

## Component Usage

```vue
<script setup lang="ts">
import { UseElementOverflow } from '@vueuse/components'
</script>

<template>
  <UseElementOverflow v-slot="{ isXOverflowed }" style="width: 100px;overflow: hidden;">
    <button v-if="isXOverflowed">
      show more
    </button>
    <span v-else>some words may be too long to show here</span>
  </UseElementOverflow>
</template>
```

## Directive Usage

```vue
<script>
import type { UseElementOverflowReturn } from '@vueuse/core'
import { vElementOverflow } from '@vueuse/components'
import { ref } from 'vue'

export default {
  setup() {
    const isXOverflowed = ref(false)
    function onXOverflowChanged(info: UseElementOverflowReturn) {
      isXOverflowed.value = info.isXOverflowed
    }
    return {
      isXOverflowed,
      onXOverflowChanged,
    }
  },
}
</script>

<template>
  <div v-element-overflow="onXOverflowChanged" style="width: 100px;overflow: hidden;">
    <button v-if="isXOverflowed">
      show more
    </button>
    <span v-else>some words may be too long to show here</span>
  </div>
</template>
```
