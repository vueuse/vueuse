---
category: Utilities
---

# useAsyncFunction

Reactive async function state

## usage
```ts
import { useAsyncFunction } from '@vueuse/core'

const fn = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve('result')
  }, 1000)
})

const { result, trigger, result, calls } = useAsyncFunction(fn)

onMounted(async () => {
  await trigger()

  console.log(result.value) // 'result'
  console.log(calls.value) // 1
})
```

## Usage with multicalls
```ts
import { useAsyncFunction } from '@vueuse/core'

const fn = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve('result')
  }, 1000)
})

const { result, trigger, result, calls, loadingCalls } = useAsyncFunction(fn, { several: true })

onMounted(async () => {
  const promises = [trigger(), trigger(), trigger()]

  console.log(loadingCalls.value) // 3

  await promises

  console.log(loadingCalls.value) // 0
  console.log(calls.value) // 3
  console.log(result.value) // ['result', 'result', 'result']
})
```
