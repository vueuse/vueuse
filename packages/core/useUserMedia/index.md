---
category: Sensors
related: useDevicesList, usePermission
---

# useUserMedia

Reactive [`mediaDevices.getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) streaming.

## Usage

```js
import { useUserMedia } from '@vueuse/core'

const { stream, start } = useUserMedia()

start()
```

```ts
const video = document.getElementById('video')

watchEffect(() => {
  // preview on a video element
  video.srcObject = stream.value
})
```

### Devices

```js
import { useDevicesList, useUserMedia } from '@vueuse/core'

const {
  videoInputs: cameras,
  audioInputs: microphones,
} = useDevicesList({
  requestPermissions: true,
})
const currentCamera = computed(() => cameras.value[0]?.deviceId)
const currentMicrophone = computed(() => microphones.value[0]?.deviceId)

const { stream } = useUserMedia({
  constraints: {
    video: { deviceId: currentCamera },
    audio: { deviceId: currentMicrophone, }
  }
})
```
