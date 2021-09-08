import { defineComponent, unref } from 'vue-demi'
import { MaybeRef } from '@vueuse/shared'

export type VueInstance = InstanceType<ReturnType<typeof defineComponent>>
export type MaybeElementRef = MaybeRef<Element | VueInstance | undefined | null>

/**
 * Get the dom element of a ref of element or Vue component instance
 *
 * @param elRef
 */
export function unrefElement(elRef: MaybeElementRef): HTMLElement | SVGElement | undefined {
  const plain = unref(elRef)
  return (plain as VueInstance)?.$el ?? plain
}
