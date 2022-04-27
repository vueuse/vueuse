---
category: Sensors
---

# useDeviceOrientation

Reactive [DeviceOrientationEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent). Provide web developers with information from the physical orientation of the device running the web page.

## Usage

```js
import { useDeviceOrientation } from '@vueuse/core'

const {
  isAbsolute,
  alpha,
  beta,
  gamma,
} = useDeviceOrientation()
```

| State      | Type     | Description                                                                                                                |
| ---------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| isAbsolute | `boolean` | A boolean that indicates whether or not the device is providing orientation data absolutely.                               |
| alpha      | `number` | A number representing the motion of the device around the z axis, express in degrees with values ranging from 0 to 360.    |
| beta       | `number` | A number representing the motion of the device around the x axis, express in degrees with values ranging from -180 to 180. |
| gamma      | `number` | A number representing the motion of the device around the y axis, express in degrees with values ranging from -90 to 90.   |

You can find [more information about the state on the MDN](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent#Properties).

## Component Usage

```html
<UseDeviceOrientation v-slot="{ alpha, beta, gamma }">
  Alpha: {{ alpha }}
  Beta: {{ beta }}
  Gamma: {{ gamma }}
</UseDeviceOrientation>
```
