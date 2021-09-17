---
category: Sensors
---

# useMouse

Reactive mouse position

## Basic Usage

```js
import { useMouse } from '@vueuse/core'

const { x, y, source } = useMouse()
```

Touch is enabled by default. To only detect mouse changes, set `touch` to `false`.
The `dragover` event is used to track mouse position while dragging.

```js
const { x, y } = useMouse({ touch: false })
```

## Component
```html
<UseMouse v-slot="{ x, y }">
  x: {{ x }}
  y: {{ y }}
</UseMouse>
```
