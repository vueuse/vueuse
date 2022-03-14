import type { ComponentPublicInstance } from 'vue-demi'
import { unref } from 'vue-demi'
import type { MaybeRef } from '@vueuse/shared'

export type VueInstance = ComponentPublicInstance
export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T | undefined | null>
export type MaybeElement = HTMLElement | SVGElement | VueInstance

export type UnRefElementReturn<T extends MaybeElement = MaybeElement> = T extends VueInstance ? HTMLElement | SVGElement | undefined | null : T | undefined

/**
 * Get the dom element of a ref of element or Vue component instance
 *
 * @param elRef
 */
export function unrefElement<T extends MaybeElement>(elRef: MaybeElementRef<T>): UnRefElementReturn<T> {
  const plain = unref(elRef)
  return (plain as unknown as VueInstance)?.$el ?? plain
}
