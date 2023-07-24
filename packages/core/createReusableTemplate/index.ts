import type { DefineComponent, Slot } from 'vue-demi'
import { defineComponent, isVue3, shallowRef, version } from 'vue-demi'
import { makeDestructurable } from '@vueuse/shared'

// copied from vue: https://github.com/vuejs/core/blob/3be4e3cbe34b394096210897c1be8deeb6d748d8/packages/shared/src/general.ts#L90-L112
function cacheStringFunction<T extends (str: string) => string>(fn: T): T {
  const cache: Record<string, string> = Object.create(null)
  return ((str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }) as T
}

const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cacheStringFunction((str: string) =>
  str.replace(hyphenateRE, '-$1').toLowerCase(),
)

const camelizeRE = /-(\w)/g
export const camelize = cacheStringFunction((str: string): string => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})

export type DefineTemplateComponent<
  Bindings extends object, Slots extends Record<string, Slot | undefined>,
> = DefineComponent<{}> & {
  new(): { $slots: { default(_: Bindings & { $slots: Slots }): any } }
}

export type ReuseTemplateComponent<
  Bindings extends object, Slots extends Record<string, Slot | undefined>,
> = DefineComponent<Bindings> & {
  new(): { $slots: Slots }
}

export type ReusableTemplatePair<
  Bindings extends object, Slots extends Record<string, Slot | undefined>,
> = [
  DefineTemplateComponent<Bindings, Slots>,
  ReuseTemplateComponent<Bindings, Slots>,
] & {
  define: DefineTemplateComponent<Bindings, Slots>
  reuse: ReuseTemplateComponent<Bindings, Slots>
}

/**
 * This function creates `define` and `reuse` components in pair,
 * It also allow to pass a generic to bind with type.
 *
 * @see https://vueuse.org/createReusableTemplate
 */
export function createReusableTemplate<
  Bindings extends object, Slots extends Record<string, Slot | undefined> = Record<string, Slot | undefined>,
>(): ReusableTemplatePair<Bindings, Slots> {
  // compatibility: Vue 2.7 or above
  if (!isVue3 && !version.startsWith('2.7.')) {
    if (process.env.NODE_ENV !== 'production')
      throw new Error('[VueUse] createReusableTemplate only works in Vue 2.7 or above.')
    // @ts-expect-error incompatible
    return
  }

  const render = shallowRef<Slot | undefined>()

  const define = defineComponent({
    setup(_, { slots }) {
      return () => {
        render.value = slots.default
      }
    },
  }) as DefineTemplateComponent<Bindings, Slots>

  const reuse = defineComponent({
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => {
        if (!render.value && process.env.NODE_ENV !== 'production')
          throw new Error('[VueUse] Failed to find the definition of reusable template')
        return render.value?.({ ...keysToCamelKebabCase(attrs), $slots: slots })
      }
    },
  }) as ReuseTemplateComponent<Bindings, Slots>

  return makeDestructurable(
    { define, reuse },
    [define, reuse],
  ) as any
}

function keysToCamelKebabCase(obj: Record<string, any>) {
  const newObj: typeof obj = {}
  for (const key in obj) {
    const camelKey = camelize(key)
    const kebabKey = hyphenate(key)
    newObj[camelKey] = obj[key]
    newObj[kebabKey] = obj[key]
  }
  return newObj
}
