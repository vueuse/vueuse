import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { tryOnMounted } from '@vueuse/shared'
import { shallowRef, toValue, watch } from 'vue'
import { unrefElement } from '../unrefElement'
import { useCurrentElement } from '../useCurrentElement'

export function useParentElement(
  element: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined> = useCurrentElement<HTMLElement | SVGAElement>(),
): Readonly<ShallowRef<HTMLElement | SVGElement | null | undefined>> {
  const parentElement = shallowRef<HTMLElement | SVGElement | null | undefined>()

  const update = () => {
    const el = unrefElement(element)
    if (el)
      parentElement.value = el.parentElement
  }

  tryOnMounted(update)
  watch(() => toValue(element), update)

  return parentElement
}
