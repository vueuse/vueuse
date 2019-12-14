/* eslint import/no-extraneous-dependencies: off */
import Vue from 'vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import { createComponent } from '@vue/composition-api'
import { SetupFunction, Data } from '@vue/composition-api/dist/component'

const localVue = createLocalVue()

export default function renderHook<V, Props = unknown, Data = unknown> (
  setup: SetupFunction<Props, Data>,
) {
  // @ts-ignore
  const App = createComponent({
    template: '<div ref="app" id="app"></div>',
    setup,
  })

  return shallowMount<Vue & V>(App, {
    localVue,
  })
}
