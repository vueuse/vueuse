import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { defineComponent } from 'vue-demi'
import { useReducer, Action } from '.'

const initialState = { count: 0 }

function reducer(state: any, action: Action): void {
  switch (action.type) {
    case 'increment':
      (state.count += 1)
      return
    case 'decrement':
      (state.count -= 1)
  }
}

export const SimpleDemo = defineComponent({
  setup() {
    const { state, dispatch } = useReducer(reducer, initialState)

    return {
      state,
      dispatch,
    }
  },
  render(this: Vue & { state: any; dispatch: (a: Action) => void}) {
    return (
      <div id="demo">
          Count: {this.state.count}
        <button onClick={() => this.dispatch({ type: 'decrement' })}>-</button>
        <button onClick={() => this.dispatch({ type: 'increment' })}>+</button>
      </div>
    )
  },
})
