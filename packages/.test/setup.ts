import { install, isVue2, Vue2 } from 'vue-demi'
import './polyfillFetch'
import './polyfillPointerEvents'

const createLocalStorage = () => {
  let state: Record<string, any> = {}

  const localStorageMock: Storage = {
    getItem: vitest.fn(x => state[x]),
    setItem: vitest.fn((x, v) => state[x] = v),
    // @ts-ignore
    removeItem: vitest.fn((x, v) => delete state[x]),
    clear: vitest.fn(() => state = {}),
  }

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  })
}

const createLocation = () => {
  const baseURL = 'https://vueuse.org'
  Object.defineProperty(window, 'location', {
      value: new URL(baseURL),
      writable: true,
    })
    window.location.search = ''
    window.location.hash = ''
}

const setupVueSwitch = () => {
  if (isVue2) {
    Vue2.config.productionTip = false
    Vue2.config.devtools = false
    install(Vue2)
  }
}

setupVueSwitch()

beforeEach(() => {
  createLocalStorage()
  createLocation()
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

