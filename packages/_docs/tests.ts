import Vue from 'vue'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueCompositionApi from '@vue/composition-api'
import { defineComponent, UnwrapRef } from 'vue-demi'

const localVue = createLocalVue()
localVue.use(VueCompositionApi)

export function renderHook<V, Props = unknown, Data = unknown>(
  setup: () => V,
) {
  const App = defineComponent({
    setup,
    template: '<div ref="app" id="app"></div>',
  })

  return shallowMount<Vue & UnwrapRef<V>>(App as any, { localVue })
}
