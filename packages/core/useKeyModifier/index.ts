import { Ref, ref } from 'vue-demi'
import { useEventListener, WindowEventName } from '../useEventListener'
import { ConfigurableDocument, defaultDocument } from '../_configurable'

export type KeyModifier = 'Alt' | 'AltGraph' | 'CapsLock' | 'Control' | 'Fn' | 'FnLock' | 'Meta' | 'NumLock' | 'ScrollLock' | 'Shift' | 'Symbol' | 'SymbolLock'

const defaultEvents: WindowEventName[] = ['mousedown', 'mouseup', 'keydown', 'keyup']

export interface ModifierOptions<Initial> extends ConfigurableDocument {
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
  initial?: Initial
}

export function useKeyModifier<Initial extends boolean | null>(modifier: KeyModifier, options: ModifierOptions<Initial> = {}) {
  const {
    events = defaultEvents,
    document = defaultDocument,
    initial = null,
  } = options

  const state = ref(initial) as Ref<boolean>

  if (document) {
    events.forEach((listenerEvent) => {
      useEventListener(document, listenerEvent, (evt: KeyboardEvent) => {
        state.value = evt.getModifierState(modifier)
      })
    })
  }

  return state as Ref<Initial extends boolean ? boolean : boolean | null>
}
