import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'
import { defineComponent } from 'vue-demi'

export function renderHook<V, Props = unknown, Data = unknown>(
  setup: () => V,
) {
  const App = defineComponent({
    template: '<div ref="app" id="app"></div>',
    setup,
  })

  return shallowMount<Vue & V>(App as any)
}
