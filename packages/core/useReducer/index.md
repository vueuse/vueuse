# useReducer

>

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
