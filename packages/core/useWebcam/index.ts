import { Ref, ref } from 'vue-demi'

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
export function useWebcam(
  target: Ref<HTMLVideoElement | null>,
  options: WebcamOptions = {
    isFront: false,
  },
) {
  const targetRef = ref(
    target || (document.querySelector('#webcam') as HTMLVideoElement),
  )
  const isFront = ref(options.isFront)

  const defaultConstraints = ref<MediaStreamConstraints>(options.constraints || {
    video: {
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 },
      facingMode: isFront ? 'user' : 'environment',
    },
  })

  const settings = ref<MediaTrackSettings | null>(null)

  /**
   * set webcam stream (default is video)
   */
  async function getUserMedia(constraints = defaultConstraints) {
    (constraints.value.video as MediaTrackConstraints).facingMode = isFront
      ? 'user'
      : 'environment'

    const stream = await navigator.mediaDevices.getUserMedia(constraints.value)
    settings.value = stream.getVideoTracks()[0].getSettings()

    if (targetRef.value) {
      const videoEl = targetRef.value
      videoEl.srcObject = stream
      // autoplay
      videoEl.onloadedmetadata = () => {
        videoEl.play()
      }
    }
  }

  return {
    isFront,
    settings,
    getUserMedia,
  }
}
