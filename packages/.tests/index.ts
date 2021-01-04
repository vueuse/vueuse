import { defineComponent, createApp, h, isVue2, Vue } from 'vue-demi'

if (isVue2) {
  // @ts-ignore
  Vue.config.productionTip = false
  // @ts-ignore
  Vue.config.devtools = false
}

type InstanceType<V> = V extends {new (...arg: any[]): infer X} ? X : never
type VM<V> = InstanceType<V> & {unmount(): void}

export function mount<V>(Comp: V) {
  const el = document.createElement('div')
  const app = createApp(Comp)

  type C = typeof Comp

  // @ts-ignore
  const unmount = () => app.unmount(el)
  const comp = app.mount(el) as any as VM<C>
  comp.unmount = unmount
  return comp
}

export function useSetup<V>(setup: () => V) {
  const Comp = defineComponent({
    setup,
    render() {
      return h('div', [])
    },
  })

  return mount(Comp)
}
