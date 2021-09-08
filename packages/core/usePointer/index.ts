import { MaybeRef, objectPick, toRefs } from '@vueuse/shared'
import { ref, Ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'
import { PointerType, Position } from '../_types'

export interface UsePointerState extends Position {
  pressure: number
  pointerId: number
  tiltX: number
  tiltY: number
  width: number
  height: number
  twist: number
  pointerType: PointerType | null
}

export interface UsePointerOptions extends ConfigurableWindow {
  /**
   * Pointer types that listen to.
   *
   * @default ['mouse', 'touch', 'pen']
   */
  pointerTypes?: PointerType[]

  /**
   * Initial values
   */
  initialValue?: MaybeRef<Partial<UsePointerState>>
}

const defaultState: UsePointerState = /* #__PURE__ */ {
  x: 0,
  y: 0,
  pointerId: 0,
  pressure: 0,
  tiltX: 0,
  tiltY: 0,
  width: 0,
  height: 0,
  twist: 0,
  pointerType: null,
}
const keys = /* #__PURE__ */ Object.keys(defaultState) as (keyof UsePointerState)[]

/**
 * Reactive pointer state.
 *
 * @see https://vueuse.org/usePointer
 * @param options
 */
export function usePointer(options: UsePointerOptions = {}) {
  const {
    window = defaultWindow,
  } = options

  const state = ref(options.initialValue || {}) as unknown as Ref<UsePointerState>
  Object.assign(state.value, defaultState, state.value)

  const handler = (event: PointerEvent) => {
    if (options.pointerTypes && !options.pointerTypes.includes(event.pointerType as PointerType))
      return

    state.value = objectPick(event, keys, false) as UsePointerState
  }

  if (window) {
    useEventListener(window, 'pointerdown', handler, { passive: true })
    useEventListener(window, 'pointermove', handler, { passive: true })
  }

  return {
    ...toRefs(state),
  }
}
