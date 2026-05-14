import type { ComponentObjectPropsOptions, DefineComponent, Slot } from 'vue'
import { camelize, makeDestructurable } from '@vueuse/shared'
import { defineComponent, getCurrentInstance } from 'vue'

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

export interface CreateReusableTemplateOptions<Props extends Record<string, any>> {
  /**
   * Inherit attrs from reuse component.
   *
   * @default true
   */
  inheritAttrs?: boolean
  /**
   * Name for the reuse component (useful for devtools).
   */
  name?: string
  /**
   * Props definition for reuse component.
   */
  props?: ComponentObjectPropsOptions<Props>
}

/**
 * This function creates `define` and `reuse` components in pair,
 * It also allow to pass a generic to bind with type.
 *
 * @see https://vueuse.org/createReusableTemplate
 *
 * @__NO_SIDE_EFFECTS__
 */
export function createReusableTemplate<
  Bindings extends Record<string, any>,
  MapSlotNameToSlotProps extends ObjectLiteralWithPotentialObjectLiterals = Record<'default', undefined>,
>(
  options: CreateReusableTemplateOptions<Bindings> = {},
): ReusableTemplatePair<Bindings, MapSlotNameToSlotProps> {
  const {
    inheritAttrs = true,
    name = 'ReusableTemplate',
  } = options

  const renderMap = new WeakMap<object, Slot | undefined>()

  const getReusableTemplateRegistrationInstance = () => {
    const instance = getCurrentInstance()
    return instance?.parent ?? instance
  }

  const getReusableTemplateInstance = () => {
    let instance = getCurrentInstance()
    while (instance && !renderMap.has(instance))
      instance = instance.parent
    return instance
  }

  const define = defineComponent({
    name: `${name}.define`,
    setup(_, { slots }) {
      return () => {
        const instance = getReusableTemplateRegistrationInstance()
        if (instance)
          renderMap.set(instance, slots.default)
      }
    },
  }) as unknown as DefineTemplateComponent<Bindings, MapSlotNameToSlotProps>

  const reuse = defineComponent({
    inheritAttrs,
    name: `${name}.reuse`,
    props: options.props,
    setup(props, { attrs, slots }) {
      return () => {
        const instance = getReusableTemplateInstance()
        const render = instance ? renderMap.get(instance) : undefined
        if (!render && process.env.NODE_ENV !== 'production')
          throw new Error('[VueUse] Failed to find the definition of reusable template')
        const vnode = render?.({
          ...(options.props == null
            ? keysToCamelKebabCase(attrs)
            : props),
          $slots: slots,
        })

        return (inheritAttrs && vnode?.length === 1) ? vnode[0] : vnode
      }
    },
  }) as unknown as ReuseTemplateComponent<Bindings, MapSlotNameToSlotProps>

  return makeDestructurable(
    { define, reuse },
    [define, reuse],
  ) as ReusableTemplatePair<Bindings, MapSlotNameToSlotProps>
}

function keysToCamelKebabCase(obj: Record<string, any>) {
  const newObj: typeof obj = {}
  for (const key in obj)
    newObj[camelize(key)] = obj[key]
  return newObj
}
