# useWebWorkerFunction

> Run Code in Web Worker. Extract Function in Web Worker and call them via promises.

## Usage

```jsx
import { useWebWorkerFunction } from '@vueuse/core'


const sortNumbers = nums => nums.sort();
const numbers = [...Array(5000000)].map(ele => ~~(Math.random() * 1000000));

export default {
  setup() {
    const { workerHook } = useWebWorkerFunction(sortNumbers);
    return { workerHook }
  },

  const doHeavyLifting = async () => {
    const data = await workerHook(numbers)
    ...
  }
}
```
