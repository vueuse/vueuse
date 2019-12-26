import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { createComponent } from '../api'

const localVue = createLocalVue()

export default function renderHook<V, Props = unknown, Data = unknown> (
  setup: any,
) {
  const App = createComponent({
    template: '<div ref="app" id="app"></div>',
    setup,
  })

  return shallowMount<Vue & V>(App as any, {
    localVue,
  })
}
