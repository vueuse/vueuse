---
category: Sensors
---

# usePointerSwipe

Reactive swipe detection based on [PointerEvents](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent).

## Usage

```vue
<script setup>
import { usePointerSwipe } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')
const { isSwiping, direction } = usePointerSwipe(el)
</script>

<template>
  <div ref="el">
    Swipe here
  </div>
</template>
```

## Directive Usage

```vue
<script setup lang="ts">
import type { Position, UseSwipeDirection } from '@vueuse/core'
import { vPointerSwipe } from '@vueuse/components'
import { ref } from 'vue'

interface PointerSwipeType {
  isSwiping: boolean
  direction: UseSwipeDirection
  posStart: Position
  posEnd: Position
  distanceX: number
  distanceY: number
}

const isSwiping = ref(false)
function onSwipe(state: PointerSwipeType) {
  isSwiping.value = state.isSwiping
}
</script>

<template>
  <li v-pointer-swipe="onSwipe">
    {{ isSwiping ? 'You are swiping!' : 'Swipe me!' }}
  </li>
</template>
```

You can also provide swipe options:

```vue
<script setup lang="ts">
import type { Position, UseSwipeDirection } from '@vueuse/core'
import { vPointerSwipe } from '@vueuse/components'
import { ref } from 'vue'

interface PointerSwipeType {
  isSwiping: boolean
  direction: UseSwipeDirection
  posStart: Position
  posEnd: Position
  distanceX: number
  distanceY: number
}

const isSwiping = ref(false)
function onSwipe(state: PointerSwipeType) {
  isSwiping.value = state.isSwiping
}

const options = {
  threshold: 10,
  disableTextSelect: true,
  onSwipeEnd: (e: TouchEvent, direction: UseSwipeDirection) => {
    console.log('ended')
  },
}
</script>

<template>
  <li v-pointer-swipe="[onSwipe, options]">
    {{ isSwiping ? 'You are swiping!' : 'Swipe me!' }}
  </li>
</template>
```
