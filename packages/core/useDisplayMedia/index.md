---
category: Sensors
related: useUserMedia
---

# useDisplayMedia

Reactive [`mediaDevices.getDisplayMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) streaming.

## Usage

```ts
import { useDisplayMedia } from '@vueuse/core'

const { stream, start } = useDisplayMedia()

// start streaming

start()
```

```ts
const video = document.getElementById('video')

watchEffect(() => {
  // preview on a video element
  video.srcObject = stream.value
})
```
