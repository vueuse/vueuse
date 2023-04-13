---
category: Sensors
---

# useDevicesList

Reactive [enumerateDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices) listing available input/output devices.

## Usage

```js
import { useDevicesList } from '@vueuse/core'

const {
  devices,
  videoInputs: cameras,
  audioInputs: microphones,
  audioOutputs: speakers,
} = useDevicesList()
```

# Component
```html
<UseDevicesList v-slot="{ videoInputs, audioInputs, audioOutputs }">
  Cameras: {{ videoInputs }}
  Microphones: {{ audioInputs }}
  Speakers: {{ audioOutputs }}
</UseDevicesList>
```
