import { reactive } from 'vue-demi'

export interface Action {
  type: string
  [propName: string]: any
}

type StateInterface = any [] | object

export function useReducer(reducer: (state: StateInterface, action: Action,) => void, initialState: StateInterface = {}) {
  const state = reactive(initialState)

  const dispatch = (action: Action): void => {
    reducer(state, action)
  }

  return { state, dispatch }
}
