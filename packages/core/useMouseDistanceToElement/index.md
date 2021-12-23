---
category: Sensors
---

# useMouseDistanceToElement

Reactive mouse position relative to an element's center and edge, also returns useMouseInElement.

## Usage

```html {15}
<template>
  <div ref="target">
    <h1>Hello, Vue Use!</h1>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useMouseRelativeToElement } from '@vueuse/core'

export default {
  setup() {
    const target = ref(null)

    const { 
      elementDistanceToCenter, 
      elementDistanceToBoundary, 
      isOutside 
    } = useMouseRelativeToElement(target)

    return { 
      elementDistanceToCenter, 
      elementDistanceToBoundary, 
      isOutside 
    }
  }
}
</script>
```

## Component
```html
<UseMouseDistanceToElement v-slot="{ elementDistanceToCenter, elementDistanceToBoundary, isOutside }">
  Distance to center: {{ elementDistanceToCenter }}
  Closest distance to edge: {{ elementDistanceToBoundary }}
  Is Outside: {{ isOutside }}
</UseMouseDistanceToElement>
```

## Related Functions

- `useMouse`
- `useMouseInElement`
