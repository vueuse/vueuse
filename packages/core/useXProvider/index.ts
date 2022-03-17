import type { DefineComponent, PropType, SetupContext, VNode } from 'vue-demi'
import { defineComponent, h, inject, isVue2, provide, reactive, readonly } from 'vue-demi'
import { tryOnUnmounted } from '@vueuse/shared'
import { setData } from './type'
import type { Path, PathValue, Tobj } from './type'

type TProviderComponent = DefineComponent<{ value: Tobj }, () => VNode | VNode[] | undefined, any>
/**
 * @see https://vueuse.org/useXProvider
 */
export const useXProvider = <T extends Tobj>(defaultState: Partial<T>, providerComponentName = 'Context.Provider', injectKeyName = Symbol('xProvider')) => {
  const state = reactive<T>({} as unknown as T)

  // @ts-expect-error ignore ts(2589): Type instantiation is excessively deep and possibly infinite.
  function setState(...args: [obj: Partial<T>]): void
  function setState<TT extends Partial<T>, P extends Path<TT>>(...args: [path: P, value: PathValue<TT, P>]): void
  function setState<TT extends Partial<T>, P extends Path<TT>>(...args: [obj: Partial<T>] | [path: P, value: PathValue<TT, P>]): void {
    if (args.length === 1) {
      const [obj] = args
      Object.entries(obj).forEach(([k, v]) => {
        // @ts-expect-error no need for tslint
        state[k] = v
      })
    }
    else {
      const [path, value] = args
      setData(state as TT, path, value)
    }
  }

  const ProviderComponent = defineComponent({
    name: providerComponentName,
    props: {
      value: {
        type: {} as unknown as PropType<Partial<T>>,
        required: false,
      },
    },
    // @ts-expect-error ignore overload check
    setup(props: { value: any }, { slots }: SetupContext) {
      setState(defaultState)
      if (props.value)
        setState(props.value)

      provide(injectKeyName, readonly(state))

      tryOnUnmounted(() => {
        Object.keys(state).forEach((key) => {
          delete state[key]
        })
      })

      return () => isVue2 ? h('div', slots.default?.()) : slots.default?.()
    },
  }) as TProviderComponent

  const useContext = () => {
    return inject(injectKeyName, defaultState as T || ({} as T))
  }
  return {
    ProviderComponent,
    state,
    setState,
    useContext,
  }
}
