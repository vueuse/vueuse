---
category: Elements
---

# useDraggable

Make elements draggable.

## Usage

```vue
<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const el = useTemplateRef('el')

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { x, y, style } = useDraggable(el, {
  initialValue: { x: 40, y: 40 },
})
</script>

<template>
  <div ref="el" :style="style" style="position: fixed">
    Drag me! I am at {{ x }}, {{ y }}
  </div>
</template>
```

### Return Values

| Property     | Type                   | Description                                                                             |
| ------------ | ---------------------- | --------------------------------------------------------------------------------------- |
| `x`          | `Ref<number>`          | Current x position                                                                      |
| `y`          | `Ref<number>`          | Current y position                                                                      |
| `position`   | `Ref<{x, y}>`          | Current position object                                                                 |
| `isDragging` | `ComputedRef<boolean>` | Whether currently dragging                                                              |
| `snapped`    | `ComputedRef<boolean>` | Whether the element is currently snapped to a target (see [Snapping](#snapping))        |
| `style`      | `ComputedRef<string>`  | CSS style string (`left: ?px; top: ?px;` or `transform`, depending on `output`)         |
| `recalc`     | `() => void`           | Recompute snapping and bounds against the current position (e.g. after a layout change) |

### Options

```ts
useDraggable(el, {
  // Initial position (default: { x: 0, y: 0 })
  initialValue: { x: 40, y: 40 },
  // Restrict dragging to specific axis: 'x', 'y', or 'both' (default)
  axis: 'both',
  // Only trigger when clicking directly on the element (default: false)
  exact: false,
  // Prevent default browser behavior (default: false)
  preventDefault: true,
  // Stop event propagation (default: false)
  stopPropagation: false,
  // Use capture phase for events (default: true)
  capture: true,
  // Disable dragging (default: false)
  disabled: false,
  // Mouse buttons that trigger drag (default: [0] - left button)
  buttons: [0],
  // Pointer types to listen to (default: ['mouse', 'touch', 'pen'])
  pointerTypes: ['mouse', 'touch', 'pen'],
  // Custom drag handle element (default: target element)
  handle: handleRef,
  // Container element for bounds (default: none). Accepts an element or a bounds object
  containerElement: containerRef,
  // Element to attach pointermove/pointerup events (default: window)
  draggingElement: window,
  // Restrict the element within the visible area of the container (default: false)
  restrictInView: false,
  // Auto-scroll the container when dragging near its edges (default: false)
  autoScroll: { speed: 2, margin: 30, direction: 'both' },
  // How the position is applied: 'leftTop' (default) or 'transform'
  output: 'leftTop',
  // z-index applied while dragging, restored on release (default: false)
  zIndex: 100,
  // CSS classes applied automatically
  classes: {
    draggable: 'is-draggable', // applied on mount
    dragging: 'is-dragging', // applied while pointer is held down
    moving: 'is-moving', // applied from first movement until release
  },
  // Cursor styles applied automatically
  cursor: {
    idle: 'grab', // cursor when not dragging (pass false to skip)
    dragging: 'grabbing', // cursor during drag (applied to body, pass false to skip)
  },
  // Snap to points, lines, grids, or element edges (see Snapping)
  snap: { step: 30 },
  // Callbacks
  onStart: (position, event) => {
    // Return false to prevent dragging
  },
  onMove: (position, event) => {},
  onEnd: (position, event) => {},
  // Fired once on the first actual movement of each drag session
  onMoveStart: (position, event) => {},
  // Fired before each position update. Return a Position to override, or false to cancel the move
  onBeforeMove: (position, event) => {},
})
```

### Prevent Default

Set `preventDefault: true` to override the default drag-and-drop behavior of certain elements in the browser (e.g., images).

```ts
import { useDraggable } from '@vueuse/core'

const { x, y, style } = useDraggable(el, {
  preventDefault: true,
})
```

### Container Bounds

Use `containerElement` to constrain dragging within a container.

```ts
import { useDraggable } from '@vueuse/core'

const { x, y } = useDraggable(el, {
  containerElement: containerRef,
})
```

Besides an element, `containerElement` also accepts a bounds object (`DraggableBounds`), where each value can be a number (px) or a percentage string:

```ts
const { x, y } = useDraggable(el, {
  containerElement: { left: 0, top: 0, width: '100%', height: 400 },
})
```

### Auto Scroll

Set `autoScroll: true` to enable auto-scroll when dragging near the edges.

```ts
const { x, y, style } = useDraggable(el, {
  autoScroll: {
    speed: 2, // Control the speed of auto-scroll.
    margin: 30, // Set the margin from the edge that triggers auto-scroll.
    direction: 'both' // Determine the direction of auto-scroll.
  },
})
```

For tiered acceleration, pass a `speed` array paired with a `sensitivity` array of the same length. Each `sensitivity` value is an exclusive distance threshold (px from the edge) — the closer the pointer is to the edge, the faster the scroll. You may also clamp the reachable scroll range with `minX`/`maxX`/`minY`/`maxY`.

```ts
const { x, y } = useDraggable(el, {
  autoScroll: {
    speed: [40, 200, 1000],
    sensitivity: [100, 40, 10],
    direction: 'both',
    maxY: 2000,
  },
})
```

### Output Mode

By default `style` emits `left: ?px; top: ?px;`, which requires the element to be `position: fixed` or `absolute`. Set `output: 'transform'` to emit a GPU-accelerated `transform: translate3d(...)` instead, which works with any CSS `position`.

```ts
const { style } = useDraggable(el, {
  output: 'transform',
})
```

### Classes & Cursor

Use `classes` to automatically toggle CSS classes during the drag lifecycle, and `cursor` to control the cursor when idle and while dragging.

```ts
const { x, y } = useDraggable(el, {
  classes: {
    draggable: 'is-draggable',
    dragging: 'is-dragging',
    moving: 'is-moving',
  },
  cursor: {
    idle: 'grab',
    dragging: 'grabbing',
  },
})
```

### Snapping

Use `snap` to snap the element to points, lines, grids, or the edges of another element while dragging. The returned `snapped` ref reflects whether the element is currently snapped.

```ts
const { x, y, snapped } = useDraggable(el, {
  // Snap to a 30×30 grid
  snap: { step: 30 },
})
```

More examples:

```ts
// Vertical guide line at x = 100
useDraggable(el, { snap: { x: 100 } })

// Vertical line at x = 100, only active for y in [0, 50%]
useDraggable(el, { snap: { x: 100, y: { start: 0, end: '50%' } } })

// Two vertical guide lines
useDraggable(el, { snap: [{ x: 100 }, { x: 300 }] })

// Snap to the edges of another element
useDraggable(el, { snap: { boundingBox: targetEl } })

// Grid with a custom gravity (snap distance)
useDraggable(el, { snap: { targets: [{ step: 30 }], gravity: 15 } })
```

## Component Usage

```vue
<template>
  <UseDraggable v-slot="{ x, y }" :initial-value="{ x: 10, y: 10 }">
    Drag me! I am at {{ x }}, {{ y }}
  </UseDraggable>
</template>
```

For component usage, additional props `storageKey` and `storageType` can be passed to the component and enable the persistence of the element position.

```vue
<template>
  <UseDraggable storage-key="vueuse-draggable" storage-type="session">
    Refresh the page and I am still in the same position!
  </UseDraggable>
</template>
```
