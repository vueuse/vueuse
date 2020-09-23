import { Vue, createApp, reactive, ref, customRef } from 'vue-demi'

function createInstance<T extends object>(factory: () => T): Vue {
  return createApp({
    setup() {
      const state = ref(reactive(factory()))

      // Wrap it it in ref again so Vue only unwraps this one
      const wrappedState = customRef(() => ({
        get: () => state,
        set: value => state.value = value,
      }))

      return {
        state: wrappedState,
      }
    },
    render: () => null,
  }).mount()
}

export function createGlobalState<T extends object>(
  factory: () => T,
) {
  let instance: any = null

  return () => {
    if (instance == null)
      instance = createInstance(factory)

    return instance.state
  }
}
