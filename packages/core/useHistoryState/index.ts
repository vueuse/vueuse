import { customRef } from 'vue-demi'

export function useHistoryState<T=unknown>(name: string, defaultValue?: T) {
  let value = history.state?.[name] ?? defaultValue

  return customRef((track, trigger) => {
    return {
      get() {
        track()

        return value
      },
      set(newValue) {
        value = newValue

        history.replaceState({
          ...history.state,
          [name]: value,
        }, '')

        trigger()
      },
    }
  })
}
