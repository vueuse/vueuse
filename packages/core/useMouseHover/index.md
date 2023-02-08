---
category: Sensors
---

# useMouseHover

Reactive mouse hover state. Triggered by `mouseenter` `mouseleave` on target element

## Basic Usage

```js
import { useMouseHover } from '@vueuse/core'

const { isHovering } = useMouseHover()
```

#### MouseHoverOptions

| Property   | Type   | Description                                                    |
| ---------- | ------ | -------------------------------------------------------------- |
| enterDelay | number | Delays setting `isHovering` to `true` for this amount in `ms`  |
| leaveDelay | number | Delays setting `isHovering` to `false` for this amount in `ms` |