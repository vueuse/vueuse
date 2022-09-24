---
category: Sensors
---

# useParallax

Create parallax effect easily. It uses `useDeviceOrientation` and fallback to `useMouse` if orientation is not supported.

## Usage

```html
<div ref='container'>
</div>
```

```js
import { useParallax } from '@vueuse/core'

export default {
  setup() {
    const container = ref(null)
    const { tilt, roll, source } = useParallax(container)

    return {
      container,
    }
  },
}
```
