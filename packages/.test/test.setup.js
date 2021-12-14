const { install, isVue2, Vue2 } = require('vue-demi')

if (isVue2) {
  // @ts-ignore
  Vue2.config.productionTip = false
  // @ts-ignore
  Vue2.config.devtools = false

  install(Vue2)
}

let state = {}

const localStorageMock = {
  getItem: vitest.fn(x => state[x]),
  setItem: vitest.fn((x, v) => state[x] = v),
  removeItem: vitest.fn((x, v) => delete state[x]),
  clear: vitest.fn(() => state = {}),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})
