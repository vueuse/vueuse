import { createLocalVue, mount } from '@vue/test-utils'
import VueCompositionApi from '@vue/composition-api'
import { Vue, defineComponent, UnwrapRef } from 'vue-demi'

const localVue = createLocalVue()
localVue.use(VueCompositionApi)

export function renderHook<V>(
  setup: () => V,
) {
  const App = defineComponent({
    setup,
    template: '<div ref="app" id="app"></div>',
  })

  return mount<Vue & UnwrapRef<V>>(App as any, { localVue })
}
