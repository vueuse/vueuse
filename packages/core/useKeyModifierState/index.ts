import { ref } from 'vue-demi'
import { useEventListener, WindowEventName } from '../useEventListener'

export type Modifier = 'Alt' | 'AltGraph' | 'CapsLock' | 'Control' | 'Fn' | 'FnLock' | 'Meta' | 'NumLock' | 'ScrollLock' | 'Shift' | 'Symbol' | 'SymbolLock'

const defaultEvents: WindowEventName[] = ['mousedown', 'mouseup', 'keydown', 'keyup']

export interface ModifierOptions {
  /**
   * Event names that will prompt update to modifier states
   *
   * @default ['mousedown', 'mouseup', 'keydown', 'keyup']
   */
  events?: WindowEventName[]
}

export function useKeyModifierState(modifier: Modifier, options: ModifierOptions = {}) {
  const {
    events = defaultEvents,
  } = options
  const state = ref<null | boolean>(null)
  events.forEach((listenerEvent) => {
    useEventListener(document, listenerEvent, (evt: KeyboardEvent) => {
      state.value = evt.getModifierState(modifier)
    })
  })
  return state
}
