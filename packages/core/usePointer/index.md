---
category: Sensors
---

# usePointer

Reactive [pointer state](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).

## Basic Usage

```js
import { usePointer } from '@vueuse/core'

const { x, y, pressure, pointerType } = usePointer()
```

## Component
```html
<UsePointer v-slot="{ x, y }">
  x: {{ x }}
  y: {{ y }}
</UsePointer>
```
