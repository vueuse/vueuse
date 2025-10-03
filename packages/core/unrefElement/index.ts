import type { ComponentPublicInstance, MaybeRef, MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

type EmitFuncs<T> = T extends (event: infer J, ...args: any[]) => void & infer K ? (event: J extends string ? any : J, ...args: any[]) => void & EmitFuncs<K> : void
export type VueInstance = {
  [key in keyof ComponentPublicInstance]: key extends '$emit' ? EmitFuncs<ComponentPublicInstance[key]> : ComponentPublicInstance[key]
}
export type MaybeElementRef<T extends MaybeElement = MaybeElement> = MaybeRef<T>
export type MaybeComputedElementRef<T extends MaybeElement = MaybeElement> = MaybeRefOrGetter<T>
export type MaybeElement = HTMLElement | SVGElement | VueInstance | undefined | null

export type UnRefElementReturn<T extends MaybeElement = MaybeElement> = T extends VueInstance ? Exclude<MaybeElement, VueInstance> : T | undefined

/**
 * Get the dom element of a ref of element or Vue component instance
 *
 * @param elRef
 */
export function unrefElement<T extends MaybeElement>(elRef: MaybeComputedElementRef<T>): UnRefElementReturn<T> {
  const plain = toValue(elRef)
  return (plain as VueInstance)?.$el ?? plain
}
