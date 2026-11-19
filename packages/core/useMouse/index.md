---
category: Sensors
---

# useMouse

Reactive mouse position

## Basic Usage

```ts twoslash
import { useMouse } from '@vueuse/core'

const { x, y, sourceType } = useMouse()
```

Touch is enabled by default. To only detect mouse changes, set `touch` to `false`.
The `dragover` event is used to track mouse position while dragging.

```ts twoslash
import { useMouse } from '@vueuse/core'
// ---cut---
const { x, y } = useMouse({ touch: false })
```

## Initial Values

Before the first event (e.g. during SSR), `x` and `y` are `0`. Set your own initial values with `initials`. They are also restored on `touchend` when `resetOnTouchEnds` is set:

```ts twoslash
import { useMouse } from '@vueuse/core'
// ---cut---
const { x, y } = useMouse({ initials: { x: 100, y: 100 } })
```

The returned refs are readonly. To own the state, pass your own refs to `initials`, `useMouse` writes into them.

## Custom Extractor

It's also possible to provide a custom extractor function to get the position from the event.

```ts twoslash
import type { UseMouseEventExtractor } from '@vueuse/core'
import { useMouse, useParentElement } from '@vueuse/core'

const parentEl = useParentElement()

const extractor: UseMouseEventExtractor = event => (
  event instanceof MouseEvent
    ? [event.offsetX, event.offsetY]
    : null
)

const { x, y, sourceType } = useMouse({ target: parentEl, type: extractor })
```

## Component Usage

```vue
<template>
  <UseMouse v-slot="{ x, y }">
    x: {{ x }}
    y: {{ y }}
  </UseMouse>
</template>
```
