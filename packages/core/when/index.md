# when

> Await ref/reactive changes, a.k.a one time async condition watch.

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
import { when, usCounter, invoke } from '@vueuse/core'

const { count } = usCounter()

invoke(async() => {
  await when(count).toMatch(v => v > 7)

  alert('Counter is now larger than 7!')
})
```
