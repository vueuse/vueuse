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

  /**
   * Initial value of the returned ref
   *
   * @default null
   */
  initial?: null | boolean

}

export function useKeyModifierState(modifier: Modifier, options: ModifierOptions = {}) {
  const {
    events = defaultEvents,
    document = defaultDocument,
    initial = null,
  } = options
  const state = ref<null | boolean>(initial)
  events.forEach((listenerEvent) => {
    if (document) {
      useEventListener(document, listenerEvent, (evt: KeyboardEvent) => {
        state.value = evt.getModifierState(modifier)
      })
    }
  })
  return state
}
