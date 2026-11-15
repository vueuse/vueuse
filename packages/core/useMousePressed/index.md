---
category: Sensors
---

# useMousePressed

Reactive mouse pressing state. Triggered by `mousedown` `touchstart` on target element and released by `mouseup` `mouseleave` `touchend` `touchcancel` on window.

## Basic Usage

```ts
import { useMousePressed } from '@vueuse/core'

const { pressed } = useMousePressed()
```

Touching is enabled by default. To make it only detects mouse changes, set `touch` to `false`

```ts
import { useMousePressed } from '@vueuse/core'
// ---cut---
const { pressed } = useMousePressed({ touch: false })
```

To only capture `mousedown` and `touchstart` on specific element, you can specify `target` by passing a ref of the element.

```vue
<script setup lang="ts">
import { useMousePressed } from '@vueuse/core'
// ---cut---
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')

const { pressed } = useMousePressed({ target: el })
</script>

<template>
  <div ref="el">
    Only clicking on this element will trigger the update.
  </div>
</template>
```

## Initial Values

Before the first event (e.g. during SSR), `pressed` is `false`. Set your own initial value with `initials`:

```ts
import { useMousePressed } from '@vueuse/core'
// ---cut---
const { pressed } = useMousePressed({ initials: { pressed: true } })
```

The returned refs are readonly. To own the state, pass your own ref to `initials`, `useMousePressed` writes into it.

## Component Usage

```vue
<template>
  <UseMousePressed v-slot="{ pressed }">
    Is Pressed: {{ pressed }}
  </UseMousePressed>
</template>
```
