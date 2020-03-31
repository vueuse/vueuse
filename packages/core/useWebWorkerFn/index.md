# useWebWorkerFn

> `useWebWorkerFn()` is a js library (with typescript support) that allows you to use the Web Worker Web API, through React Hooks. This library allows you to run the expensive function without blocking the user interface, using a simple syntax that makes use of Promise



## Usage

```jsx
import { useWebWorkerFn } from '@vueuse/core'

const sortNumbers = nums => nums.sort()
const numbers = [...Array(5000000)].map(ele => ~~(Math.random() * 1000000))

export default createComponent({
  setup() {
    const { workerHook } = useWebWorkerFn(sortNumbers)

    const runSort = async() => {
      const data = workerHook(numbers)
    }

    return { runSort }
  },
})
```
