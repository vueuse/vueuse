---
category: Sensors
---

# useDevicesList

Reactive [enumerateDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices) listing avaliable input/output devices.

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

<!--FOOTER_STARTS-->


## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useDevicesList/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useDevicesList/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useDevicesList/index.md)


<!--FOOTER_ENDS-->
