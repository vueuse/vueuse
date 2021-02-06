import { defineComponent, unref } from 'vue-demi'
import { MaybeRef } from '../dist'

export type VueInstance = InstanceType<ReturnType<typeof defineComponent>>
export type ElementMaybeRef = MaybeRef<Element | VueInstance | undefined | null>

/**
 * Get the dom element of a ref of element or Vue component instance
 *
 * @param elRef
 */
export function unrefElement(elRef: ElementMaybeRef) {
  const plain = unref(elRef)
  return (plain as VueInstance)?.$el ?? plain ?? undefined
}
