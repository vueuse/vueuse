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
  getItem: jest.fn(x => state[x]),
  setItem: jest.fn((x, v) => state[x] = v),
  removeItem: jest.fn((x, v) => delete state[x]),
  clear: jest.fn(() => state = {}),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})
