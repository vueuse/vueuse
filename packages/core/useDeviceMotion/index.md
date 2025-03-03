---
category: Sensors
---

# useDeviceMotion

Reactive [DeviceMotionEvent](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent). Provide web developers with information about the speed of changes for the device's position and orientation.

## Usage

```js
import { useDeviceMotion } from '@vueuse/core'

const {
  acceleration,
  accelerationIncludingGravity,
  rotationRate,
  interval,
} = useDeviceMotion()
```

> Note: For iOS, you need to use `trigger` and bind it with user interaction.
> After permission granted, the API will run automatically

| State                        | Type            | Description                                                                                                          |
| ---------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------- |
| acceleration                 | `object`        | An object giving the acceleration of the device on the three axis X, Y and Z.                                        |
| accelerationIncludingGravity | `object`        | An object giving the acceleration of the device on the three axis X, Y and Z with the effect of gravity.             |
| rotationRate                 | `object`        | An object giving the rate of change of the device's orientation on the three orientation axis alpha, beta and gamma. |
| interval                     | `Number`        | A number representing the interval of time, in milliseconds, at which data is obtained from the device..             |
| ensurePermissions            | `boolean`       | Indicates whether the platform requires permission to use the API                                                    |
| permissionGranted            | `boolean`       | Indicates whether the user has granted permission. The default is always false                                       |
| trigger                      | `Promise<void>` | An async function to request user permission. The API runs automatically once permission is granted                  |

You can find [more information about the state on the MDN](https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent#instance_properties).

## Component Usage

```vue
<template>
  <UseDeviceMotion v-slot="{ acceleration }">
    Acceleration: {{ acceleration }}
  </UseDeviceMotion>
</template>
```
