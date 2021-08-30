import { ref } from 'vue-demi'
import { useEventListener, WindowEventName } from '../useEventListener'
import { ConfigurableDocument, defaultDocument } from '../_configurable'

export type Modifier = 'Alt' | 'AltGraph' | 'CapsLock' | 'Control' | 'Fn' | 'FnLock' | 'Meta' | 'NumLock' | 'ScrollLock' | 'Shift' | 'Symbol' | 'SymbolLock'

const defaultEvents: WindowEventName[] = ['mousedown', 'mouseup', 'keydown', 'keyup']

export interface ModifierOptions extends ConfigurableDocument {
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
    document = defaultDocument,
  } = options
  const state = ref<null | boolean>(null)
  events.forEach((listenerEvent) => {
    useEventListener(document, listenerEvent, (evt: KeyboardEvent) => {
      state.value = evt.getModifierState(modifier)
    })
  })
  return state
}
