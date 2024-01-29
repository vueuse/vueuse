// eslint-disable-next-line no-restricted-imports
import { getCurrentInstance, onMounted, onUpdated } from 'vue-demi'
import { computedWithControl } from '@vueuse/shared'
import type { MaybeElement, MaybeElementRef, VueInstance } from '../unrefElement'
import { unrefElement } from '../unrefElement'

export function useCurrentElement<T extends VueInstance = VueInstance, R extends MaybeElement = MaybeElement>(
  rootComponent?: MaybeElementRef<T>,
) {
  const vm = getCurrentInstance()!
  const currentElement = computedWithControl(
    () => null,
    () => (rootComponent ? unrefElement(rootComponent) : vm.proxy!.$el) as R,
  )

  onUpdated(currentElement.trigger)
  onMounted(currentElement.trigger)

  return currentElement
}
