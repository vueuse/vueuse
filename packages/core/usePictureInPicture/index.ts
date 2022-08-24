import { computed, ref } from 'vue-demi'

import type { MaybeElementRef } from '../unrefElement'

import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'

export function usePictureInPicture(
  el: MaybeElementRef<HTMLVideoElement | undefined>,
) {
  const video = ref(el)

  const isSupported = useSupported(() => document && 'pictureInPictureEnabled' in document && !video.value?.disablePictureInPicture)

  const pictureInPictureWindow = ref<PictureInPictureWindow | null>(null)

  const isInPictureInPictureMode = computed(() => {
    return !!pictureInPictureWindow.value
  })

  useEventListener(video, 'leavepictureinpicture', () => pictureInPictureWindow.value = null)

  const togglePictureInPicture = async () => {
    if (!isSupported.value || !video || !video.value || video.value.disablePictureInPicture)
      return

    if (!document.pictureInPictureElement) {
      pictureInPictureWindow.value = await video.value.requestPictureInPicture()
    }
    else {
      await document.exitPictureInPicture()
      pictureInPictureWindow.value = null
    }
  }

  return {
    isSupported,
    isInPictureInPictureMode,
    pictureInPictureWindow,
    togglePictureInPicture,
  }
}
