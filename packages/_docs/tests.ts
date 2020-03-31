import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { defineComponent, init } from '../api'

const localVue = createLocalVue()

export function renderHook<V, Props = unknown, Data = unknown>(
  setup: () => V,
) {
  init()

  const App = defineComponent({
    template: '<div ref="app" id="app"></div>',
    setup,
  })

  return shallowMount<Vue & V>(App as any, {
    localVue,
  })
}
