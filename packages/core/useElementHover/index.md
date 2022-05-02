---
category: Sensors
---

# useElementHover

Reactive element's hover state.

## Usage

```vue
<script setup>
import { useElementHover } from '@vueuse/core'

const myHoverableElement = ref()
const isHovered = useElementHover(myHoverableElement)
</script>

<template>
  <button ref="myHoverableElement">
    {{ isHovered }}
  </button>
</template>
```

## Directive Usage

```html
<script setup lang="ts">
import { ref } from 'vue'
import { vElementHover } from '@vueuse/components'

const isHovered = ref(false)
function onHover(state: boolean) {
  isHovered.value = state
}
</script>

<template>
  <button v-element-hover="onHover">
    {{ isHovered ? 'Thank you!' : 'Hover me' }}
  </button>
</template>
```
