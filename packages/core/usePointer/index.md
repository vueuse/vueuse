---
category: Sensors
---

# usePointer

Reactive [pointer state](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).

## Basic Usage

```ts
import { usePointer } from '@vueuse/core'

const { x, y, pressure, pointerType } = usePointer()
```

## Initial Values

Before the first event (e.g. during SSR), all values are `0`, `pointerType` is `null` and `isInside` is `false`. Set your own initial values with `initials`:

```ts
import { usePointer } from '@vueuse/core'
// ---cut---
const { x, y } = usePointer({ initials: { x: 100, y: 100 } })
```

The returned refs are readonly. To own the state, pass your own refs to `initials`, `usePointer` writes into them.

## Component Usage

By default, the component will track the pointer on `window`

```vue
<template>
  <UsePointer v-slot="{ x, y }">
    x: {{ x }}
    y: {{ y }}
  </UsePointer>
</template>
```

To track local position in the element, set `target="self"`:

```vue
<template>
  <UsePointer v-slot="{ x, y }" target="self">
    x: {{ x }} y: {{ y }}
  </UsePointer>
</template>
```
