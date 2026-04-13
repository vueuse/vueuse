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

## Type Declarations

```ts
export interface UseUserMediaOptions extends ConfigurableNavigator {
  /**
   * If the stream is enabled
   * @default false
   */
  enabled?: MaybeRef<boolean>
  /**
   * Recreate stream when deviceIds or constraints changed
   *
   * @default true
   */
  autoSwitch?: MaybeRef<boolean>
  /**
   * MediaStreamConstraints to be applied to the requested MediaStream
   * If provided, the constraints will override videoDeviceId and audioDeviceId
   *
   * @default {}
   */
  constraints?: MaybeRef<MediaStreamConstraints>
}
/**
 * Reactive `mediaDevices.getUserMedia` streaming
 *
 * @see https://vueuse.org/useUserMedia
 * @param options
 */
export declare function useUserMedia(options?: UseUserMediaOptions): {
  isSupported: ComputedRef<boolean>
  stream: Ref<MediaStream | undefined, MediaStream | undefined>
  start: () => Promise<MediaStream | undefined>
  stop: () => void
  restart: () => Promise<MediaStream | undefined>
  constraints: Ref<
    | MediaStreamConstraints
    | {
        audio?:
          | boolean
          | {
              advanced?:
                | {
                    aspectRatio?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    autoGainControl?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    backgroundBlur?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    channelCount?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    deviceId?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    displaySurface?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    echoCancellation?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    facingMode?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    frameRate?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    groupId?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    height?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    noiseSuppression?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    sampleRate?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    sampleSize?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    width?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                  }[]
                | undefined
              aspectRatio?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              autoGainControl?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              backgroundBlur?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              channelCount?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              deviceId?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              displaySurface?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              echoCancellation?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              facingMode?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              frameRate?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              groupId?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              height?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              noiseSuppression?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              sampleRate?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              sampleSize?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              width?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
            }
          | undefined
        peerIdentity?: string | undefined
        preferCurrentTab?: boolean | undefined
        video?:
          | boolean
          | {
              advanced?:
                | {
                    aspectRatio?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    autoGainControl?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    backgroundBlur?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    channelCount?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    deviceId?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    displaySurface?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    echoCancellation?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    facingMode?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    frameRate?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    groupId?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    height?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    noiseSuppression?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    sampleRate?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    sampleSize?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    width?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                  }[]
                | undefined
              aspectRatio?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              autoGainControl?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              backgroundBlur?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              channelCount?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              deviceId?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              displaySurface?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              echoCancellation?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              facingMode?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              frameRate?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              groupId?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              height?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              noiseSuppression?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              sampleRate?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              sampleSize?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              width?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
            }
          | undefined
      }
    | undefined,
    | MaybeRef<MediaStreamConstraints>
    | {
        audio?:
          | boolean
          | {
              advanced?:
                | {
                    aspectRatio?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    autoGainControl?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    backgroundBlur?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    channelCount?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    deviceId?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    displaySurface?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    echoCancellation?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    facingMode?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    frameRate?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    groupId?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    height?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    noiseSuppression?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    sampleRate?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    sampleSize?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    width?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                  }[]
                | undefined
              aspectRatio?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              autoGainControl?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              backgroundBlur?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              channelCount?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              deviceId?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              displaySurface?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              echoCancellation?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              facingMode?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              frameRate?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              groupId?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              height?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              noiseSuppression?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              sampleRate?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              sampleSize?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              width?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
            }
          | undefined
        peerIdentity?: string | undefined
        preferCurrentTab?: boolean | undefined
        video?:
          | boolean
          | {
              advanced?:
                | {
                    aspectRatio?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    autoGainControl?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    backgroundBlur?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    channelCount?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    deviceId?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    displaySurface?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    echoCancellation?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    facingMode?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    frameRate?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    groupId?:
                      | string
                      | string[]
                      | {
                          exact?: string | string[] | undefined
                          ideal?: string | string[] | undefined
                        }
                      | undefined
                    height?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    noiseSuppression?:
                      | boolean
                      | {
                          exact?: boolean | undefined
                          ideal?: boolean | undefined
                        }
                      | undefined
                    sampleRate?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    sampleSize?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                    width?:
                      | number
                      | {
                          exact?: number | undefined
                          ideal?: number | undefined
                          max?: number | undefined
                          min?: number | undefined
                        }
                      | undefined
                  }[]
                | undefined
              aspectRatio?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              autoGainControl?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              backgroundBlur?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              channelCount?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              deviceId?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              displaySurface?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              echoCancellation?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              facingMode?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              frameRate?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              groupId?:
                | string
                | string[]
                | {
                    exact?: string | string[] | undefined
                    ideal?: string | string[] | undefined
                  }
                | undefined
              height?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              noiseSuppression?:
                | boolean
                | {
                    exact?: boolean | undefined
                    ideal?: boolean | undefined
                  }
                | undefined
              sampleRate?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              sampleSize?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
              width?:
                | number
                | {
                    exact?: number | undefined
                    ideal?: number | undefined
                    max?: number | undefined
                    min?: number | undefined
                  }
                | undefined
            }
          | undefined
      }
    | undefined
  >
  enabled:
    | Ref<boolean, boolean>
    | ShallowRef<boolean, boolean>
    | WritableComputedRef<boolean, boolean>
    | ShallowRef<true, true>
    | ShallowRef<false, false>
  autoSwitch:
    | Ref<boolean, boolean>
    | ShallowRef<boolean, boolean>
    | WritableComputedRef<boolean, boolean>
    | ShallowRef<true, true>
    | ShallowRef<false, false>
}
export type UseUserMediaReturn = ReturnType<typeof useUserMedia>
```
