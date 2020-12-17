import { defineComponent, createApp, h, isVue2, Vue } from 'vue-demi'

if (isVue2) {
  // @ts-ignore
  Vue.config.productionTip = false
  // @ts-ignore
  Vue.config.devtools = false
}

type InstanceType<V> = V extends {new (...arg: any[]): infer X} ? X : never
type VM<V> = InstanceType<V> & {unmount(): void}

export function renderHook<V>(setup: () => V) {
  const Comp = defineComponent({
    setup,
    render() {
      return h('div', [])
    },
  })

  const el = document.createElement('div')
  const app = createApp(Comp)

  if (isVue2) {
    const unmount = () => app.unmount()
    const comp = app.mount(el) as any as VM<typeof Comp>
    comp.unmount = unmount
    return comp
  }
  else {
    // @ts-ignore
    const unmount = () => app.unmount(el)
    app.mount(el)
    const comp = (app as any)._component as VM<typeof Comp>
    comp.unmount = unmount
    return comp
  }
}
