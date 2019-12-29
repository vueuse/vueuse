# useDeviceLight

> The [DeviceLightEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceLightEvent) provides web developers with information from photo sensors or similar detectors about ambient light levels near the device. For example this may be useful to adjust the screen's brightness based on the current ambient light level in order to save energy or provide better readability.

## Usage

```js
import { useDeviceLight } from '@vueuse/core'

const light = useDeviceLight()
```

| State | Type     | Description                                                                 |
| ----- | -------- | --------------------------------------------------------------------------- |
| light | `Number` | The level of the ambient light in [lux](https://en.wikipedia.org/wiki/Lux). |
