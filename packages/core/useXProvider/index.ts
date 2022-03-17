import { defineComponent, provide, inject, readonly, SetupContext, PropType, reactive, onUnmounted, isVue2, h, DefineComponent, VNode } from 'vue-demi'

type Tobj = {
  [key: PropertyKey]: any
}
type TProviderComponent = DefineComponent<{ value: Tobj }, () => VNode | VNode[] | undefined, any>
/**
 * @see https://vueuse.org/useXProvider
 */
export const useXProvider = <T extends Tobj>(defaultState: Partial<T>, providerComponentName = 'Context.Provider', injectKeyName = Symbol('xProvider')) => {
  const state = reactive<T>({} as any)

  const setState = (obj: Partial<T>) => {
    Object.entries(obj).forEach(([k, v]) => {
      // @ts-ignore
      state[k] = v
    })
  }

  const setStateSimple = <K extends keyof T, V extends T[K]>(key: K, value: V) => {
    // @ts-ignore
    state[key] = value
  }

  const ProviderComponent = defineComponent({
    name: providerComponentName,
    props: {
      value: {
        type: Object as PropType<Partial<T>>,
        required: false,
      },
    },
    setup(props: { value: any }, { slots }: SetupContext) {
      setState(defaultState)
      if (props.value)
        setState(props.value)

      provide(injectKeyName, readonly(state))

      onUnmounted(() => {
        Object.keys(state).forEach((key) => {
          // @ts-ignore
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
    setStateSimple,
    useContext,
  }
}
