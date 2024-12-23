import type { DefineComponent, Slot } from 'vue'
import { camelize, makeDestructurable } from '@vueuse/shared'
import { defineComponent, shallowRef } from 'vue'

type ObjectLiteralWithPotentialObjectLiterals = Record<string, Record<string, any> | undefined>

type GenerateSlotsFromSlotMap<T extends ObjectLiteralWithPotentialObjectLiterals> = {
  [K in keyof T]: Slot<T[K]>
}

export type DefineTemplateComponent<
  Bindings extends Record<string, any>,
  MapSlotNameToSlotProps extends ObjectLiteralWithPotentialObjectLiterals,
> = DefineComponent & {
  new(): { $slots: { default: (_: Bindings & { $slots: GenerateSlotsFromSlotMap<MapSlotNameToSlotProps> }) => any } }
}

export type ReuseTemplateComponent<
  Bindings extends Record<string, any>,
  MapSlotNameToSlotProps extends ObjectLiteralWithPotentialObjectLiterals,
> = DefineComponent<Bindings> & {
  new(): { $slots: GenerateSlotsFromSlotMap<MapSlotNameToSlotProps> }
}

export type ReusableTemplatePair<
  Bindings extends Record<string, any>,
  MapSlotNameToSlotProps extends ObjectLiteralWithPotentialObjectLiterals,
> = [
  DefineTemplateComponent<Bindings, MapSlotNameToSlotProps>,
  ReuseTemplateComponent<Bindings, MapSlotNameToSlotProps>,
] & {
  define: DefineTemplateComponent<Bindings, MapSlotNameToSlotProps>
  reuse: ReuseTemplateComponent<Bindings, MapSlotNameToSlotProps>
}

export interface CreateReusableTemplateOptions {
  /**
   * Inherit attrs from reuse component.
   *
   * @default true
   */
  inheritAttrs?: boolean
}

/**
 * This function creates `define` and `reuse` components in pair,
 * It also allow to pass a generic to bind with type.
 *
 * @see https://vueuse.org/createReusableTemplate
 */
export function createReusableTemplate<
  Bindings extends Record<string, any>,
  MapSlotNameToSlotProps extends ObjectLiteralWithPotentialObjectLiterals = Record<'default', undefined>,
>(
  options: CreateReusableTemplateOptions = {},
): ReusableTemplatePair<Bindings, MapSlotNameToSlotProps> {
  const {
    inheritAttrs = true,
  } = options

  const render = shallowRef<Slot | undefined>()

  const define = defineComponent({
    setup(_, { slots }) {
      return () => {
        render.value = slots.default
      }
    },
  }) as unknown as DefineTemplateComponent<Bindings, MapSlotNameToSlotProps>

  const reuse = defineComponent({
    inheritAttrs,
    setup(_, { attrs, slots }) {
      return () => {
        if (!render.value && process.env.NODE_ENV !== 'production')
          throw new Error('[VueUse] Failed to find the definition of reusable template')
        const vnode = render.value?.({ ...keysToCamelKebabCase(attrs), $slots: slots })

        return (inheritAttrs && vnode?.length === 1) ? vnode[0] : vnode
      }
    },
  }) as unknown as ReuseTemplateComponent<Bindings, MapSlotNameToSlotProps>

  return makeDestructurable(
    { define, reuse },
    [define, reuse],
  ) as any
}

function keysToCamelKebabCase(obj: Record<string, any>) {
  const newObj: typeof obj = {}
  for (const key in obj)
    newObj[camelize(key)] = obj[key]
  return newObj
}
