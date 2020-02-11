import Vue from 'vue'
import CompositionAPI from '@vue/composition-api'

export * from '@vue/composition-api'

export const version = 2

export function init() {
  Vue.use(CompositionAPI)
}
