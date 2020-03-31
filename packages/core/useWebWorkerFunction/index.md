# useWebWorkerFunction

> `useWebWorkerFunction()` is a js library (with typescript support) that allows you to use the Web Worker Web API, through React Hooks. This library allows you to run the expensive function without blocking the user interface, using a simple syntax that makes use of Promise



## Usage

```jsx
import { useWebWorkerFunction } from '@vueuse/core'

const sortNumbers = nums => nums.sort()
const numbers = [...Array(5000000)].map(ele => ~~(Math.random() * 1000000))

export default createComponent({
  setup() {
    const { workerHook } = useWebWorkerFunction(sortNumbers)
    return { workerHook }
  },

  doHeavyLifting = async() => {
    const data = await this.workerHook(numbers)
    // ...
  },
})
```
