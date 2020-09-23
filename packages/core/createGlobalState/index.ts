import { createApp, reactive } from 'vue-demi'

function withScope<T extends object>(factory: () => T): T {
  const container = document.createElement('div')

  let state: T = null as any

  createApp({
    setup() {
      state = reactive(factory()) as T
    },
    render: () => null,
  }).mount(container)

  return state
}

export function createGlobalState<T extends object>(
  factory: () => T,
) {
  let state: T

  return () => {
    if (state == null)
      state = withScope(factory)

    return state
  }
}
