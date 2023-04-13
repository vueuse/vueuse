import type { MaybeRefOrGetter } from '@vueuse/shared'
import { toValue, tryOnMounted } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { shallowRef, watch } from 'vue-demi'
import { unrefElement } from '../unrefElement'
import { useCurrentElement } from '../useCurrentElement'

export function useParentElement(
  element: MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined> = useCurrentElement<HTMLElement | SVGAElement>(),
): Readonly<Ref<HTMLElement | SVGElement | null | undefined>> {
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
