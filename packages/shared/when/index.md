# when

> Promised one-time watch for ref changes

## Usage

#### Wait for some async data to be ready

```js
import { when, useAsyncState } from '@vueuse/core'

const { state, ready } = useAsyncState(
  fetch('https://jsonplaceholder.typicode.com/todos/1').then(t => t.json()),
  {},
)

;(async() => {
  await when(ready).toBe(true)

  console.log(state) // state is now ready!
})()
```

#### Wait for custom conditions

> You can use `invoke` to call the async function.

```js
import { when, useCounter, invoke } from '@vueuse/core'

const { count } = useCounter()

invoke(async() => {
  await when(count).toMatch(v => v > 7)

  alert('Counter is now larger than 7!')
})
```

#### Timeout

```ts
// will be resolve when ref.value === true or 1000ms passed
await when(ref).toBe(true, { timeout: 1000 })

// will throw if timeout
try {
  await when(ref).toBe(true, { timeout: 1000, throwOnTimeout: true })
  // ref.value === true
} catch(e) {
  // timeout
}
```

#### More Examples

```ts
await when(ref).toBe(true)
await when(ref).toMatch(v => v > 10 && v < 100)
await when(ref).changed()
await when(ref).changedTimes(10)
await when(ref).toBeTruthy()
await when(ref).toBeNull()

await when(ref).not.toBeNull()
await when(ref).not.toBeTruthy()
```
