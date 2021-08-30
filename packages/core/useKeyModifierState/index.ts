import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'

export function useKeyModifierState(modifier: string) {
  const state = ref<null | boolean>(null)
  const listenerEvents = ['keydown', 'keyup']
  listenerEvents.forEach((listenerEvent) => {
    useEventListener(document, listenerEvent, (evt: KeyboardEvent) => {
      state.value = evt.getModifierState(modifier)
    })
  })
  return state
}
