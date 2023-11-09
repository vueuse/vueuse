import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'
import type { ConfigurableWindow } from '../_configurable'
import { defaultWindow } from '../_configurable'

// TypeScript dropped the inline types for these types in 5.2
// We vendor them here to avoid the dependency

export type OrientationType = 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary'
export type OrientationLockType = 'any' | 'natural' | 'landscape' | 'portrait' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary'

export interface ScreenOrientation extends EventTarget {
  lock(orientation: OrientationLockType): Promise<void>
  unlock(): void
  readonly type: OrientationType
  readonly angle: number
  addEventListener(type: 'change', listener: (this: this, ev: Event) => any, useCapture?: boolean): void
}

/**
 * Reactive screen orientation
 *
 * @see https://vueuse.org/useScreenOrientation
 */
export function useScreenOrientation(options: ConfigurableWindow = {}) {
  const {
    window = defaultWindow,
  } = options

  const isSupported = useSupported(() => window && 'screen' in window && 'orientation' in window.screen)

  const screenOrientation = (isSupported.value ? window!.screen.orientation : {}) as ScreenOrientation

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
