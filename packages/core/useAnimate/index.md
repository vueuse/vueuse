---
category: Animation
---

# useAnimate

Reactive [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

## Usage

### Basic Usage

The `useAnimate` function will return the animate and its control function.

```html
<template>
  <span ref="el" style="display:inline-block">useAnimate</span>
</template>

<script setup>
import { ref } from 'vue'
import { useAnimate } from '@vueuse/core'

const el = ref()
const {
  isSupported,
  animate,
  play,
  pause,
  reverse,
  finish,
  cancel,
} = useAnimate(el, { transform: 'rotate(360deg)' }, 1000)
</script>
```

### With Reactive Attribute

If configure `reactive` option to true, the `useAnimate` function will return the animate state attribute with reactive along with the animate and its control function. If not configure `reactive` option, you can still get relevant animate state from the `animate`, but please note that these attribute are not with reactive and can only be accessed when needed.

```ts
const {
  isSupported,
  animate,
  play,
  pause,
  reverse,
  finish,
  cancel,
  pending,
  playState,
  replaceState,
  startTime,
  currentTime,
  timeline,
  playbackRate,
} = useAnimate(
  el,
  { transform: 'rotate(360deg)' },
  { reactive: true, duration: 100 }
)
```

### Custom Keyframes

Either an array of keyframe objects, or a keyframe object, or a `ref`. See [Keyframe Formats](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats) for more details.

```ts
const keyframes = { transform: 'rotate(360deg)' }
// Or
const keyframes = [
  { transform: 'rotate(0deg)' },
  { transform: 'rotate(360deg)' },
]
// Or
const keyframes = ref([
  { clipPath: 'circle(20% at 0% 30%)' },
  { clipPath: 'circle(20% at 50% 80%)' },
  { clipPath: 'circle(20% at 100% 30%)' },
])

useAnimate(el, keyframes, 1000)
```
