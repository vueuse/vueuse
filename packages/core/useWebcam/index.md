---
category: Sensors
---

# useWebcam

Use Web Camera by [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).

## Usage

```js
import { useWebcam } from '@vueuse/core'

const videoRef = ref(null)
const { getUserMedia, settings } = useBattery(videoRef)

onMounted(async() => {
  await getUserMedia()
  // settings only loaded after load stream
  console.log(settings)
})
```

```html
<video ref="videoRef" autoplay />
```

| State           | Type      | Description                                                       |
| --------------- | --------- | ----------------------------------------------------------------- |
|getUserMedia|`Function`|Call [MediaDevices.getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) and load stream for HTMLVideoElement.|
|settings | [MediaTrackSettings](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackSettings) | The MediaTrackSettings dictionary is used to return the current values configured for video media steam. |


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
interface WebcamOptions {
  /**
   * whether to use the front camera
   */
  isFront: boolean
  constraints?: MediaStreamConstraints
}
/**
 * https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia
 * @param target
 * @param options
 */
export declare function useWebcam(
  target: Ref<HTMLVideoElement | null>,
  options?: WebcamOptions
): {
  isFront: Ref<boolean>
  settings: Ref<{
    aspectRatio?: number | undefined
    autoGainControl?: boolean | undefined
    channelCount?: number | undefined
    deviceId?: string | undefined
    echoCancellation?: boolean | undefined
    facingMode?: string | undefined
    frameRate?: number | undefined
    groupId?: string | undefined
    height?: number | undefined
    latency?: number | undefined
    noiseSuppression?: boolean | undefined
    resizeMode?: string | undefined
    sampleRate?: number | undefined
    sampleSize?: number | undefined
    width?: number | undefined
  } | null>
  getUserMedia: (
    constraints?: Ref<{
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
                  latency?:
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
                  resizeMode?:
                    | string
                    | string[]
                    | {
                        exact?: string | string[] | undefined
                        ideal?: string | string[] | undefined
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
            latency?:
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
            resizeMode?:
              | string
              | string[]
              | {
                  exact?: string | string[] | undefined
                  ideal?: string | string[] | undefined
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
                  latency?:
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
                  resizeMode?:
                    | string
                    | string[]
                    | {
                        exact?: string | string[] | undefined
                        ideal?: string | string[] | undefined
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
            latency?:
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
            resizeMode?:
              | string
              | string[]
              | {
                  exact?: string | string[] | undefined
                  ideal?: string | string[] | undefined
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
    }>
  ) => Promise<void>
}
export {}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useWebcam/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useWebcam/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useWebcam/index.md)


<!--FOOTER_ENDS-->
