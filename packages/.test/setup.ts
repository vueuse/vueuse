import { Vue2, install, isVue2 } from 'vue-demi'
import './polyfillFetch'
import './polyfillPointerEvents'
import { beforeAll, beforeEach, vi } from 'vitest'

vi.mock('vue-demi', async () => {
  const vue = await vi.importActual<any>('vue-demi')
  if (!process.env.FUNCTIONAL_REF)
    return vue
  return {
    ...vue,
    ...await vi.importActual<any>('vue-functional-ref'),
  }
})

const setupVueSwitch = () => {
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
