# useRefHistory

> Track the change history of a ref, also provide undo and redo functionality

## Usage

```ts
import { ref } from 'vue' 
import { useRefHistory } from '@vueuse/core'

const counter = ref(0)
const { prev, undo, redo } = useRefHistory(counter, {
  deep: false,
  clone: true,
  capacity: 15, // limit to n history records, default to unlimited
})

counter.value += 1
counter.value = 10

console.log(prev) // [{ value: 10, timestamp: 1601912898062 }, { value: 1, timestamp: 1601912898061 }]

console.log(counter.value) // 10
undo()
console.log(counter.value) // 1 
```
