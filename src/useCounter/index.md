# useCounter

Basic counter with utility functions.

## Usage

```jsx {5,16}
import { useCounter } from '@vueuse/core'

const Demo = createComponent({
  setup () {
    const [count, { inc, dec, set, reset }] = useCounter()
    return {
      count,
      inc,
      dec,
      set,
      reset,
    }
  },

  render () {
    const { count, inc, dec, set, reset } = this
    return (
      <div>
        <div>count: {count}</div>
        <button onClick={() => inc()}>Increment</button>
        <button onClick={() => dec()}>Decrement</button>
        <button onClick={() => inc(5)}>Increment (+5)</button>
        <button onClick={() => dec(5)}>Decrement (-5)</button>
        <button onClick={() => set(100)}>Set (100)</button>
        <button onClick={() => reset()}>Reset</button>
      </div>
    )
  },
})
```
