import { useEventListener } from '../useEventListener'
import { ConfigurableWindow, defaultWindow } from '../_configurable'

/**
 * Show hint when close or reload page,if something does't save.
 *
 * @see https://vueuse.org/usePageClose
 */
export function usePageClose({ window = defaultWindow }: ConfigurableWindow = {}): void {
  if (!window) return
  function handler(e: Event): void {
    e.returnValue = true
  }
  useEventListener(window, 'onbeforeunload', handler)
}
