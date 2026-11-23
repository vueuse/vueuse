import type { MaybeRefInitials, ReadonlyRefs } from '@vueuse/shared'
import type { MaybeRef } from 'vue'
import type { ConfigurableWindow } from '../_configurable'
import type { PointerType, Position } from '../types'
import { objectPick } from '@vueuse/shared'
import { isRef, shallowReadonly, shallowRef, toValue } from 'vue'
import { defaultWindow } from '../_configurable'
import { useEventListener } from '../useEventListener'

export interface UsePointerState extends Position {
  /**
   * @default 0
   */
  pressure: number
  /**
   * @default 0
   */
  pointerId: number
  /**
   * @default 0
   */
  tiltX: number
  /**
   * @default 0
   */
  tiltY: number
  /**
   * @default 0
   */
  width: number
  /**
   * @default 0
   */
  height: number
  /**
   * @default 0
   */
  twist: number
  /**
   * @default null
   */
  pointerType: PointerType | null
  /**
   * Whether the pointer is inside the target
   *
   * @default false
   */
  isInside: boolean
}

/**
 * The part of the state read from the `PointerEvent`
 */
type UsePointerEventState = Omit<UsePointerState, 'isInside'>

export interface UsePointerOptions extends ConfigurableWindow {
  /**
   * Pointer types that listen to.
   *
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: PointerType[]

  /**
   * Initial values for the returned state, used before the first event.
   * A passed ref is used as the internal state.
   */
  initials?: MaybeRefInitials<UsePointerState>

  /**
   * @deprecated Use `initials` instead. Will be removed in v17.
   */
  initialValue?: MaybeRef<Partial<UsePointerEventState>>

  /**
   * @default window
   */
  target?: MaybeRef<EventTarget | null | undefined> | Document | Window
}

export interface UsePointerReturn extends ReadonlyRefs<UsePointerState> {}

/**
 * Reactive pointer state.
 *
 * @see https://vueuse.org/usePointer
 * @param options
 */
export function usePointer(options: UsePointerOptions = {}): UsePointerReturn {
  const {
    target = defaultWindow,
    initialValue: deprecatedInitialValue,
  } = options
  const deprecated: Partial<UsePointerEventState> = toValue(deprecatedInitialValue) ?? {}
  const {
    initials: {
      x: initialX = deprecated.x ?? 0,
      y: initialY = deprecated.y ?? 0,
      pressure: initialPressure = deprecated.pressure ?? 0,
      pointerId: initialPointerId = deprecated.pointerId ?? 0,
      tiltX: initialTiltX = deprecated.tiltX ?? 0,
      tiltY: initialTiltY = deprecated.tiltY ?? 0,
      width: initialWidth = deprecated.width ?? 0,
      height: initialHeight = deprecated.height ?? 0,
      twist: initialTwist = deprecated.twist ?? 0,
      pointerType: initialPointerType = deprecated.pointerType ?? null,
      isInside: initialIsInside = false,
    } = {},
  } = options

  const x = shallowRef(initialX)
  const y = shallowRef(initialY)
  const pressure = shallowRef(initialPressure)
  const pointerId = shallowRef(initialPointerId)
  const tiltX = shallowRef(initialTiltX)
  const tiltY = shallowRef(initialTiltY)
  const width = shallowRef(initialWidth)
  const height = shallowRef(initialHeight)
  const twist = shallowRef(initialTwist)
  const pointerType = shallowRef(initialPointerType)
  const isInside = shallowRef(initialIsInside)

  const handler = (event: PointerEvent) => {
    isInside.value = true
    if (options.pointerTypes && !options.pointerTypes.includes(event.pointerType as PointerType))
      return

    x.value = event.x
    y.value = event.y
    pressure.value = event.pressure
    pointerId.value = event.pointerId
    tiltX.value = event.tiltX
    tiltY.value = event.tiltY
    width.value = event.width
    height.value = event.height
    twist.value = event.twist
    pointerType.value = event.pointerType as PointerType

    // a ref passed to the deprecated `initialValue` used to be the live state
    if (isRef(deprecatedInitialValue)) {
      deprecatedInitialValue.value = objectPick(
        event,
        ['x', 'y', 'pressure', 'pointerId', 'tiltX', 'tiltY', 'width', 'height', 'twist', 'pointerType'],
        false,
      ) as UsePointerEventState
    }
  }

  if (target) {
    const listenerOptions = { passive: true }
    useEventListener(target, ['pointerdown', 'pointermove', 'pointerup'], handler, listenerOptions)
    useEventListener(target, ['pointerleave', 'pointercancel'], () => isInside.value = false, listenerOptions)
  }

  return {
    x: shallowReadonly(x),
    y: shallowReadonly(y),
    pressure: shallowReadonly(pressure),
    pointerId: shallowReadonly(pointerId),
    tiltX: shallowReadonly(tiltX),
    tiltY: shallowReadonly(tiltY),
    width: shallowReadonly(width),
    height: shallowReadonly(height),
    twist: shallowReadonly(twist),
    pointerType: shallowReadonly(pointerType),
    isInside: shallowReadonly(isInside),
  }
}
