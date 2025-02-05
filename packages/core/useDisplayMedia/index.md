---
category: Sensors
related: useUserMedia
---

# useDisplayMedia

Reactive [`mediaDevices.getDisplayMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) streaming.

## Usage

```vue
<script setup lang="ts">
import { useDisplayMedia } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const { stream, start } = useDisplayMedia()

// start streaming
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
