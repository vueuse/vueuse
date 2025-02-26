---
category: Sensors
---

# useDevicesList

Reactive [enumerateDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices) listing available input/output devices.

## Usage

```ts
import { useDevicesList } from '@vueuse/core'

const {
  devices,
  videoInputs: cameras,
  audioInputs: microphones,
  audioOutputs: speakers,
} = useDevicesList()
```

## Requesting Permissions

To request permissions, use the `ensurePermissions` method.

```ts
import { useDevicesList } from '@vueuse/core'
// ---cut---
const {
  ensurePermissions,
  permissionGranted,
} = useDevicesList()

await ensurePermissions()
console.log(permissionsGranted.value)
```

# Component

```vue
<template>
  <UseDevicesList v-slot="{ videoInputs, audioInputs, audioOutputs }">
    Cameras: {{ videoInputs }}
    Microphones: {{ audioInputs }}
    Speakers: {{ audioOutputs }}
  </UseDevicesList>
</template>
```
