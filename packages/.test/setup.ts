import { Vue2, install, isVue2 } from 'vue-demi'
import { beforeAll, beforeEach } from 'vitest'
import './polyfillFetch'
import './polyfillPointerEvents'
import './polyfillIndexedDb'
import './polyfillMatchMedia'

function setupVueSwitch() {
  if (isVue2) {
    Vue2.config.productionTip = false
    Vue2.config.devtools = false
    install(Vue2)
  }
}

setupVueSwitch()

beforeAll(() => {
  setupVueSwitch()
})

beforeEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})
