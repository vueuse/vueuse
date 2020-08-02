# useReducer

> This function is inspired by React's buildin useReducer hook. An alternative state management hook wich takes a function to mutate state of type `(state, action) => void` and returns a vue reactive state variable and a `dispatch` method to trigger updates on that state.
>
> NOTE: The name reducer is a little misleading because it's not a pure function to update the state in this implementation. Your custom reducers are mutating a reactive vue variable like shown in the example below.


## Usage

```jsx
// Import useReducer function
import { useReducer } from '@vueuse/core'

// Create Store Mutations
function reducer(state: any, action: Action): void {
  switch (action.type) {
    case 'increment':
      (state.count += 1)
      return
    case 'decrement':
      (state.count -= 1)
  }
}

// Initial State
const initialState = { count: 0 }

defineComponent({
  setup() {
    // Create Store
    const { state, dispatch } = useReducer(reducer, initialState)

    return {
      state,
      dispatch,
    }
  },
  render() {
    return (
      <div>
        Count: {this.state.count}
        <button onClick={() => this.dispatch({ type: 'decrement' })}>-</button>
        <button onClick={() => this.dispatch({ type: 'increment' })}>+</button>
      </div>
    )
  },
})
```
