---
category: Utilities
related: useThrottleFn
---

# useDebounceFn

Debounce execution of a function.

> Debounce is an overloaded waiter: if you keep asking, your requests will be ignored until you stop and give them some time to think about your latest inquiry.

## Usage

```ts
import { useDebounceFn, useEventListener } from '@vueuse/core'

const debouncedFn = useDebounceFn(() => {
  // do something
}, 1000)

useEventListener(window, 'resize', debouncedFn)
```

You can also pass a 3rd parameter to this, with a maximum wait time, similar to [lodash debounce](https://lodash.com/docs/4.17.15#debounce)

```ts
import { useDebounceFn, useEventListener } from '@vueuse/core'

// If no invokation after 5000ms due to repeated input,
// the function will be called anyway.
const debouncedFn = useDebounceFn(() => {
  // do something
}, 1000, { maxWait: 5000 })

useEventListener(window, 'resize', debouncedFn)
```

Optionally, you can get the return value of the function using promise operations.

```ts
import { useDebounceFn } from '@vueuse/core'

const debouncedFn = useDebounceFn(() => 'response', 1000)

debouncedFn().then((value) => {
  console.log(value) // 'response'
})

// or use async/await
async function doRequest() {
  const value = await debouncedFn()
  console.log(value) // 'response'
}
```

Since unhandled rejection error is quite annoying when developer doesn't need the return value, the promise will **NOT** be rejected if the function is canceled **by default**. You need to specify the option `rejectOnCancel: true` to capture the rejection.

```ts
import { useDebounceFn } from '@vueuse/core'

const debouncedFn = useDebounceFn(() => 'response', 1000, { rejectOnCancel: true })

debouncedFn()
  .then((value) => {
    // do something
  })
  .catch(() => {
    // do something when canceled
  })

// calling it again will cancel the previous request and gets rejected
setTimeout(debouncedFn, 500)
```

## Cancel

You can cancel any pending execution by calling the `cancel` method.

```ts
import { useDebounceFn } from '@vueuse/core'

const debouncedFn = useDebounceFn(() => {
  // do something
}, 1000)

debouncedFn()

// Cancel the pending execution before it runs
debouncedFn.cancel()
```

This is useful when you need to prevent the debounced function from executing, for example, when a component is unmounted or when user input changes context.

## Pending State

You can check if there's a pending execution using the `isPending` ref.

```ts
import { useDebounceFn } from '@vueuse/core'

const debouncedFn = useDebounceFn(() => {
  // do something
}, 1000)

debouncedFn()
console.log(debouncedFn.isPending.value) // true

// After debounce time elapses or cancel is called
console.log(debouncedFn.isPending.value) // false
```

This is useful for showing loading indicators or disabling UI elements while waiting for the debounced function to execute.

## Flush

You can immediately execute the pending invocation using the `flush` method.

```ts
import { useDebounceFn } from '@vueuse/core'

const debouncedFn = useDebounceFn(() => {
  // do something
}, 1000)

debouncedFn()

// Execute the pending invocation immediately instead of waiting
debouncedFn.flush()
```

This is useful when you need to ensure the debounced function runs right away, for example, before navigating away from a page or submitting a form.

## Recommended Reading

- [**Debounce vs Throttle**: Definitive Visual Guide](https://kettanaito.com/blog/debounce-vs-throttle)
