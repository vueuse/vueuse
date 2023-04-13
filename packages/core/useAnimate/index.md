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

  // actions
  play,
  pause,
  reverse,
  finish,
  cancel,

  // states
  pending,
  playState,
  replaceState,
  startTime,
  currentTime,
  timeline,
  playbackRate,
} = useAnimate(el, { transform: 'rotate(360deg)' }, 1000)
</script>
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
