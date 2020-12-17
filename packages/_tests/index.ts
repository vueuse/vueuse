import { defineComponent, createApp, h, isVue2, Vue } from 'vue-demi'

if (isVue2) {
  Vue.config.productionTip = false
  Vue.config.devtools = false
}

export function renderHook<V>(setup: () => V) {
  const App = defineComponent({
    props: {},
    setup,
    render() {
      return h('div', [])
    },
  })

  return createApp(App).mount() as typeof App extends {new (...arg: any[]): infer X} ? X : never
}
