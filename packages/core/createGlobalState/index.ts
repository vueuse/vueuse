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

/**
 * Keep states in the global scope to be reusable across Vue instances
 *
 * @param stateFactory   A factory function to create the state
 */
export function createGlobalState<T extends object>(
  stateFactory: () => T,
) {
  let state: T

  return () => {
    if (state == null)
      state = withScope(stateFactory)

    return state
  }
}
