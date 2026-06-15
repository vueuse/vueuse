---
category: Sensors
related: useDevicesList, usePermission
---

# useUserMedia

Reactive [`mediaDevices.getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) streaming.

## Usage

```vue
<script setup lang="ts">
import { useUserMedia } from '@vueuse/core'
import { useTemplateRef, watchEffect } from 'vue'

const { stream, start } = useUserMedia()
start()

const videoRef = useTemplateRef('video')
watchEffect(() => {
  // preview on a video element
  videoRef.value.srcObject = stream.value
})
</script>

<template>
  <video ref="video" />
</template>
```

### Devices

```ts
import { useDevicesList, useUserMedia } from '@vueuse/core'
import { computed, reactive } from 'vue'

const {
  videoInputs: cameras,
  audioInputs: microphones,
} = useDevicesList({
  requestPermissions: true,
})
const currentCamera = computed(() => cameras.value[0]?.deviceId)
const currentMicrophone = computed(() => microphones.value[0]?.deviceId)

const { stream } = useUserMedia({
  constraints: reactive({
    video: { deviceId: currentCamera },
    audio: { deviceId: currentMicrophone, }
  })
})
```
