# useParallax

> A tool for create parallax effect easily. It will use [useDeviceOrientation](/?path=/story/sensors--usedeviceorientation) first then fallback to [useMouse](/?path=/story/sensors--usemouse).

## Usage

```js
import { useParallax } from '@vueuse/core'

const { tilt, roll, source } = useParallax()
```

| State                        | Type     | Description                                                                                                          |
| ---------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| tilt                 | `number` | Tilt value. Scaled to `-0.5 ~ 0.5` for mouse and `-1 ~ 1` for deviceOrientation |
| roll                 | `number` | Roll value. Scaled to `-0.5 ~ 0.5` for mouse and `-1 ~ 1` for deviceOrientation |
| source | `string` | `mouse` or `deviceOrientation` |
