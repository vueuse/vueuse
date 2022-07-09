import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

/**
 * Reactive screen orientation
 *
 * @see https://vueuse.org/useScreenOrientation
 */
export const useScreenOrientation = (options: ConfigurableWindow = {}) => {
  const {
    window = defaultWindow,
  } = options

  const isSupported = useSupported(() => window && 'screen' in window && 'orientation' in window.screen)

  const screenOrientation = isSupported.value ? window!.screen.orientation : {} as ScreenOrientation

  const orientation = ref<OrientationType | undefined>(screenOrientation.type)
  const angle = ref(screenOrientation.angle || 0)

  if (isSupported.value) {
    useEventListener(window, 'orientationchange', () => {
      orientation.value = screenOrientation.type
      angle.value = screenOrientation.angle
    })
  }

  const lockOrientation = (type: OrientationLockType) => {
    if (!isSupported.value)
      return Promise.reject(new Error('Not supported'))

    return screenOrientation.lock(type)
  }

  const unlockOrientation = () => {
    if (isSupported.value)
      screenOrientation.unlock()
  }

  return {
    isSupported,
    orientation,
    angle,
    lockOrientation,
    unlockOrientation,
  }
}

export type UseScreenOrientationReturn = ReturnType<typeof useScreenOrientation>
