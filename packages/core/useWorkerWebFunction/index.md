# useWebWorkerFunction

> Run Code in Web Worker. Extract Function in Web Worker and call them via promises.

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
