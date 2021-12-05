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
  getItem: sinon.spy(x => state[x]),
  setItem: sinon.spy((x, v) => state[x] = v),
  removeItem: sinon.spy((x, v) => delete state[x]),
  clear: sinon.spy(() => state = {}),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})
