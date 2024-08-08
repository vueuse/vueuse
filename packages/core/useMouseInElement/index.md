---
category: Elements
---

# useMouseInElement

Reactive mouse position related to an element

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'

const target = ref(null)

const { x, y, isOutside } = useMouseInElement(target)
</script>

<template>
  <div ref="target">
    <h1>Hello world</h1>
  </div>
</template>
```

## Component Usage

```vue
<template>
  <UseMouseInElement v-slot="{ elementX, elementY, isOutside }">
    x: {{ elementX }}
    y: {{ elementY }}
    Is Outside: {{ isOutside }}
  </UseMouseInElement>
</template>
```

## Directive Usage

```vue
<script lang="ts" setup>
import { vMouseInElement } from '@vueuse/components'
import { UseMouseSourceType } from '@vueuse/core'

interface MouseInElement {
  x: number
  y: number
  sourceType: UseMouseSourceType
  elementX: number
  elementY: number
  elementWidth: number
  elementHeight: number
  elementPositionX: number
  elementPositionY: number
  isOutside: boolean
}

function onMouseInElement({ x, y, sourceType, elementX, elementY, elementWidth, elementHeight, elementPositionX, elementPositionY, isOutside }: MouseInElement) {
  console.log(x, y, sourceType, elementX, elementY, elementPositionX, elementPositionY, elementWidth, elementHeight, isOutside)
}
</script>

<template>
  <div v-mouse-in-element="onMouseInElement" />
</template>
```
