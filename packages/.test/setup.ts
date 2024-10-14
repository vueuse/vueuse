import { beforeAll, beforeEach } from 'vitest'
import { install, isVue2, Vue2 } from 'vue-demi'
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
