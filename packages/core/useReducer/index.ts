import { reactive, UnwrapRef } from 'vue-demi'

export interface Action {
  type: string
  [propName: string]: any
}

export function useReducer<T extends object>(reducer: (state: UnwrapRef<T>, action: Action,) => void, initialState: T) {
  const state = reactive(initialState)

  const dispatch = (action: Action): void => {
    reducer(state, action)
  }

  return { state, dispatch }
}
