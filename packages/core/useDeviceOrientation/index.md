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
  webkitCompassHeading,
  webkitCompassAccuracy
} = useDeviceOrientation()
```

| State                      | Type               | Description                                                                                                                                                                                        |
| -------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isAbsolute                 | `boolean`          | A boolean that indicates whether or not the device is providing orientation data absolutely.                                                                                                       |
| alpha                      | `number` or `null` | A number representing the motion of the device around the z axis, express in degrees with values ranging from 0 to 360.                                                                            |
| beta                       | `number` or `null` | A number representing the motion of the device around the x axis, express in degrees with values ranging from -180 to 180.                                                                         |
| gamma                      | `number` or `null` | A number representing the motion of the device around the y axis, express in degrees with values ranging from -90 to 90.                                                                           |
| webkitCompassHeading       | `number` or `null` | A number representing the difference between the motion of the device around the z axis of the world system and the direction of the north, express in degrees with values ranging from 0 to 360.  |
| webkitCompassAccuracy      | `number` or `null` | A number representing the accuracy of the compass means that the deviation is positive or negative.                                                                                                |

**N.B.** webkitCompassHeading and webkitCompassAccuracy are available on webkit specific browsers only (e.g, iOS Safari, iOS Chrome et al.). For all other devices, these values will be null.

**N.B.** It's also worth noting that for webkit browsers, permission from the user (via a user triggered event e.g., `onclick`) has to be sought before `alpha`, `beta` and `gamma` values are available.

You can find [more information about the state on the MDN](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent#Properties).

## Component

```html
<UseDeviceOrientation v-slot="{ alpha, beta, gamma, webkitCompassHeading }">
  Alpha: {{ alpha }}
  Beta: {{ beta }}
  Gamma: {{ gamma }}
  Absolute Compass Heading: {{ webkitCompassHeading }}
</UseDeviceOrientation>
```

<LearnMoreComponents />
