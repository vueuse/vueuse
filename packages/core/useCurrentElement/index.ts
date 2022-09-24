// eslint-disable-next-line no-restricted-imports
import { getCurrentInstance, onMounted, onUpdated } from 'vue-demi'
import { computedWithControl } from '@vueuse/shared'

export function useCurrentElement<T extends Element = Element>() {
  const vm = getCurrentInstance()!
  const currentElement = computedWithControl(
    () => null,
    () => vm.proxy!.$el as T,
  )

  onUpdated(currentElement.trigger)
  onMounted(currentElement.trigger)

  return currentElement
}
