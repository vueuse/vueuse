import { createApp, reactive } from 'vue-demi'

function createInstance<T extends object>(factory: () => T): T {
  const container = document.createElement('div')

  let state: T = null as any

  createApp({
    setup() {
      state = reactive(factory()) as T
    },
    render: () => null
  }).mount(container)

  return state
}

export function createGlobalState<T extends object>(
  factory: () => T,
) {
  let instance: T

  return () => {
    if (instance == null)
      instance = createInstance(factory)

    return instance
  }
}
