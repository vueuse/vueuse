---
category: Elements
---

# useElementVisibility

Tracks the visibility of an element within the viewport.

## Usage

```html
<template>
  <div ref="target">
    <h1>Hello world</h1>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useElementVisibility } from '@vueuse/core'

export default {
  setup() {
    const target = ref(null)
    const targetIsVisible = useElementVisibility(target)

    return {
      target,
      targetIsVisible,
    }
  }
}
</script>
```

## Component Usage

```html
<UseElementVisibility v-slot="{ isVisible }">
  Is Visible: {{ isVisible }}
</UseElementVisibility>
```
