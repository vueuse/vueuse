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

## Component Usage

By default, the component will track the pointer on `window`

```html
<UsePointer v-slot="{ x, y }">
  x: {{ x }}
  y: {{ y }}
</UsePointer>
```

To track local position in the element, set `target="self"`:

```html
<UsePointer target="self" v-slot="{ x, y }">
  x: {{ x }}
  y: {{ y }}
</UsePointer>
```
