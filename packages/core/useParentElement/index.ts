import type { MaybeComputedRef } from '@vueuse/shared'
import { resolveUnref, tryOnMounted } from '@vueuse/shared'
import type { Ref } from 'vue-demi'
import { shallowRef, watch } from 'vue-demi'
import { unrefElement } from '../unrefElement'
import { useCurrentElement } from '../useCurrentElement'

export function useParentElement(
  element: MaybeComputedRef<HTMLElement | SVGElement | null | undefined> = useCurrentElement<HTMLElement | SVGAElement>(),
): Readonly<Ref<HTMLElement | SVGElement | null | undefined>> {
  const parentElement = shallowRef<HTMLElement | SVGElement | null | undefined>()

  const update = () => {
    const el = unrefElement(element)
    if (el)
      parentElement.value = el.parentElement
  }

  tryOnMounted(update)
  watch(() => resolveUnref(element), update)

  return parentElement
}
