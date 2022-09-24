---
category: Utilities
---

# useAsyncQueue

Executes each asynchronous task sequentially and passes the current task result to the next task

## Usage

```ts
import { useAsyncQueue } from '@vueuse/core'

const p1 = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000)
    }, 10)
  })
}

const p2 = (result: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1000 + result)
    }, 20)
  })
}

const { activeIndex, result } = useAsyncQueue([p1, p2])

console.log(activeIndex.value) // current pending task index

console.log(result) // the tasks result
```
