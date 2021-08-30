import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'

export type Modifier = 'Alt' | 'AltGraph' | 'CapsLock' | 'Control' | 'Fn' | 'FnLock' | 'Meta' | 'NumLock' | 'ScrollLock' | 'Shift' | 'Symbol' | 'SymbolLock'

export function useKeyModifierState(modifier: Modifier) {
  const state = ref<null | boolean>(null)
  const listenerEvents = ['keydown', 'keyup']
  listenerEvents.forEach((listenerEvent) => {
    useEventListener(document, listenerEvent, (evt: KeyboardEvent) => {
      state.value = evt.getModifierState(modifier)
    })
  })
  return state
}
