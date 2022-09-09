// eslint-disable-next-line no-restricted-imports
import { getCurrentInstance, onMounted, onUpdated } from 'vue-demi'
import { computedWithControl } from '@vueuse/shared'

export function useCurrentElement<T extends Element = Element>() {
  const vm = getCurrentInstance()!
  const [currentElement, update] = computedWithControl(
    () => null,
    () => vm.proxy!.$el as T,
    true,
  )

  onUpdated(update)
  onMounted(update)

  return currentElement
}
