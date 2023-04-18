---
category: Sensors
---

# useMouse

Reactive mouse position

## Basic Usage

```js
import { useMouse } from '@vueuse/core'

const { x, y, sourceType } = useMouse()
```

Touch is enabled by default. To only detect mouse changes, set `touch` to `false`.
The `dragover` event is used to track mouse position while dragging.

```js
const { x, y } = useMouse({ touch: false })
```

## Usage With Extractor

```js
import { type UseMouseExtractFn, useMouse, useParentElement } from '@vueuse/core'

const parentEl = useParentElement()

const extractor: UseMouseExtractFn = event => (
  event instanceof Touch
    ? null
    : { x: event.offsetX, y: event.offsetY }
)

const { x, y, sourceType } = useMouse({ target: parentEl, type: extractor })
```

Touch is enabled by default. To only detect mouse changes, set `touch` to `false`.
The `dragover` event is used to track mouse position while dragging.

```js
const { x, y } = useMouse({ touch: false })
```

## Component Usage

```html
<UseMouse v-slot="{ x, y }">
  x: {{ x }}
  y: {{ y }}
</UseMouse>
```
