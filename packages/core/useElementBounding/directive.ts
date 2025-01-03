import type { ObjectDirective, Reactive } from 'vue'
import type { UseElementBoundingOptions, UseElementBoundingReturn } from '.'
import { reactiveOmit } from '@vueuse/shared'
import { reactive, watch } from 'vue'
import { useElementBounding } from '.'

type ElementBounding = Omit<UseElementBoundingReturn, 'update'>
type BindingValueFunction = (bounding: Reactive<ElementBounding>) => void
type BindingValueArray = [BindingValueFunction, UseElementBoundingOptions]

export const vElementBounding: ObjectDirective<
  HTMLElement,
  BindingValueFunction | BindingValueArray
> = {
  mounted(el, binding) {
    const [handler, options] = (typeof binding.value === 'function' ? [binding.value, {}] : binding.value) as BindingValueArray

    const state = reactiveOmit(reactive(useElementBounding(el, options)), 'update')
    watch(state, val => handler(val))
  },
}
