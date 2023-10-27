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

## Custom Extractor

It's also possible to provide a custom extractor function to get the position from the event.

```ts
import type { UseMouseEventExtractor } from '@vueuse/core'
import { useMouse, useParentElement } from '@vueuse/core'

const parentEl = useParentElement()

const extractor: UseMouseEventExtractor = event => (event instanceof Touch
  ? null
  : [event.offsetX, event.offsetY]
)

const { x, y, sourceType } = useMouse({ target: parentEl, type: extractor })
```

## Component Usage

```html
<UseMouse v-slot="{ x, y }">
  x: {{ x }}
  y: {{ y }}
</UseMouse>
```
