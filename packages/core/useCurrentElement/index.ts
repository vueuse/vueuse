import type { IsAny } from '@vueuse/shared'
import type { MaybeElement, MaybeElementRef, VueInstance } from '../unrefElement'
import { computedWithControl } from '@vueuse/shared'
// eslint-disable-next-line no-restricted-imports
import { getCurrentInstance, onMounted, onUpdated } from 'vue'
import { unrefElement } from '../unrefElement'

export function useCurrentElement<
  T extends MaybeElement = MaybeElement,
  R extends VueInstance = VueInstance,
  E extends MaybeElement = MaybeElement extends T ? IsAny<R['$el']> extends false ? R['$el'] : T : T,
>(
  rootComponent?: MaybeElementRef<R>,
) {
  const vm = getCurrentInstance()!
  const currentElement = computedWithControl(
    () => null,
    () => (rootComponent ? unrefElement(rootComponent) : vm.proxy!.$el) as E,
  )

  onUpdated(currentElement.trigger)
  onMounted(currentElement.trigger)

  return currentElement
}
