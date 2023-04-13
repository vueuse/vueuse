import type { DefineComponent, Slot } from 'vue-demi'
import { defineComponent, isVue3, version } from 'vue-demi'
import { makeDestructurable } from '@vueuse/shared'

export type DefineTemplateComponent<
  Bindings extends object,
  Slots extends Record<string, Slot | undefined>,
  Props = {},
> = DefineComponent<Props> & {
  new(): { $slots: { default(_: Bindings & { $slots: Slots }): any } }
}

export type ReuseTemplateComponent<
  Bindings extends object,
  Slots extends Record<string, Slot | undefined>,
> = DefineComponent<Bindings> & {
  new(): { $slots: Slots }
}

/**
 * This function creates `define` and `reuse` components in pair,
 * It also allow to pass a generic to bind with type.
 *
 * @see https://vueuse.org/createReusableTemplate
 */
export function createReusableTemplate<
  Bindings extends object,
  Slots extends Record<string, Slot | undefined> = Record<string, Slot | undefined>,
>(name?: string) {
  // compatibility: Vue 2.7 or above
  if (!isVue3 || !version.startsWith('2.7.')) {
    if (process.env.NODE_ENV !== 'production')
      throw new Error('[VueUse] createReusableTemplate only works in Vue 2.7 or above.')
    return
  }

  let render: Slot | undefined

  const define = defineComponent({
    setup(_, { slots }) {
      return () => {
        render = slots.default
      }
    },
  }) as DefineTemplateComponent<Bindings, Slots>

  const reuse = defineComponent({
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => {
        if (!render && process.env.NODE_ENV !== 'production')
          throw new Error(`[VueUse] Failed to find the definition of template${name ? ` "${name}"` : ''}`)
        return render?.({ ...attrs, $slots: slots })
      }
    },
  }) as ReuseTemplateComponent<Bindings, Slots>

  return makeDestructurable(
    { define, reuse },
    [define, reuse] as const,
  )
}
