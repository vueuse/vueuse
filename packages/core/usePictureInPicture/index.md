---
category: Browser
---

# usePictureInPicture

Reactive [Picture-in-Picture API](https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API).

The Picture-in-Picture API allow websites to create a floating video window always on top of other windows so that users may continue consuming media while they interact with other content sites, or applications on their device.

## Usage

```ts
import { ref } from 'vue'

import { usePictureInPicture } from '@vueuse/core'

const el = ref<HTMLVideoElement>()

const {
  isSupported,
  isInPictureInPictureMode,
  pictureInPictureWindow,
  togglePictureInPicture
} = usePictureInPicture(videoElement)
```

```html
<template>
  <video ref="el" src="..." />
</template>
```
