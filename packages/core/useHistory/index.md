# useHistory

> Track changes of a ref, and returns the history

## Usage

```ts {5,16}
import { ref } from 'vue' 
import { useHistory } from '@vueuse/core'

const counter = ref(0)
const { history } = useHistory(counter)

counter.value += 1
counter.value = 10

console.log(history) // [{ value: 1 }, { value: 10 }]
```
