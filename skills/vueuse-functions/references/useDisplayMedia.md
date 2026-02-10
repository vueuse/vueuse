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

## Type Declarations

```ts
export interface UseDisplayMediaOptions extends ConfigurableNavigator {
  /**
   * If the stream is enabled
   * @default false
   */
  enabled?: MaybeRef<boolean>
  /**
   * If the stream video media constraints
   */
  video?: boolean | MediaTrackConstraints | undefined
  /**
   * If the stream audio media constraints
   */
  audio?: boolean | MediaTrackConstraints | undefined
}
/**
 * Reactive `mediaDevices.getDisplayMedia` streaming
 *
 * @see https://vueuse.org/useDisplayMedia
 * @param options
 */
export declare function useDisplayMedia(options?: UseDisplayMediaOptions): {
  isSupported: ComputedRef<boolean>
  stream: ShallowRef<MediaStream | undefined, MediaStream | undefined>
  start: () => Promise<MediaStream | undefined>
  stop: () => void
  enabled:
    | Ref<boolean, boolean>
    | ShallowRef<boolean, boolean>
    | WritableComputedRef<boolean, boolean>
    | ShallowRef<true, true>
    | ShallowRef<false, false>
}
export type UseDisplayMediaReturn = ReturnType<typeof useDisplayMedia>
```
