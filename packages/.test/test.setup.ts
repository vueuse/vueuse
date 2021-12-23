import { install, isVue2, Vue2 } from 'vue-demi'
import nodeFetch from 'node-fetch'

if (isVue2) {
  Vue2.config.productionTip = false
  Vue2.config.devtools = false
  install(Vue2)
}

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

beforeEach(() => {
  createLocalStorage()
  createLocation()
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

// polyfill for jsdom (https://github.com/jsdom/jsdom/pull/2666)
if (!global.PointerEvent) {
  class PointerEvent extends MouseEvent {
    public pointerId?: number

    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params)
      this.pointerId = params.pointerId
    }
  }
  global.PointerEvent = PointerEvent as any
}

// Like `until` but works off of any assertion, not application code.
export const retry = (assertion: Function, { interval = 1, timeout = 100 } = {}) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const tryAgain = () => {
      setTimeout(() => {
        try {
          resolve(assertion());
        } catch (err) {
          Date.now() - startTime > timeout ? reject(err) : tryAgain();
        }
      }, interval);
    };

    tryAgain();
  });
};

// TODO: Add types for window.retry and window.fetch
// @ts-ignore
window.retry = retry
// @ts-ignore
window.fetch = nodeFetch
