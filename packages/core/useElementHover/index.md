---
category: Sensors
---

# useElementHover

Reactive element's hover state.

## Usage

### As a hook 

```vue
<template>
  <button ref="myHoverableElement">
    {{ isHovered }}
  </button>
</template>

<script setup>
import { useElementHover } from '@vueuse/core'

const myHoverableElement = ref()
const isHovered = useElementHover(myHoverableElement)
</script>
```
### As a directive

<LearnMoreComponents />

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