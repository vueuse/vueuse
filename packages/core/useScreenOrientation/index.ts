import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

/**
 *
 * Reactive screen orientation
 *
 * @see https://vueuse.org/useScreenOrientation
 */
export const useScreenOrientation = (options: ConfigurableWindow = {}) => {
  const {
    window = defaultWindow,
  } = options

  const isSupported = window && 'screen' in window && 'orientation' in window.screen

  const screen = isSupported ? window.screen : {} as Screen

  const screenOrientation = screen.orientation

  const orientation = ref<OrientationType>(screenOrientation.type)

  useEventListener(window, 'orientationchange', () => {
    orientation.value = screenOrientation.type
  })

  const lockOrientation = (type: OrientationLockType) => {
    screenOrientation.lock(type)
  }

  const unlockOrientation = () => {
    screenOrientation.unlock()
  }

  return {
    isSupported,
    screen,
    orientation,
    lockOrientation,
    unlockOrientation,
  }
}

export type UseScreenOrientationReturn = ReturnType<typeof useScreenOrientation>
