# useParallax

> Create parallax effect easily. It uses [useDeviceOrientation](/?path=/story/sensors--usedeviceorientation) and fallback to [useMouse](/?path=/story/sensors--usemouse) if orientation is not supported.

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
