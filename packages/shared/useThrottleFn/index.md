---
category: Utilities
related: refThrottled, refDebounced, useDebounceFn
---

# useThrottleFn

Throttle execution of a function. Especially useful for rate limiting execution of handlers on events like resize and scroll.

> Throttle is a spring that throws balls: after a ball flies out it needs some time to shrink back, so it cannot throw any more balls unless it's ready.

## Usage

```ts
import { useEventListener, useThrottleFn } from '@vueuse/core'

const throttledFn = useThrottleFn(() => {
  // do something, it will be called at most 1 time per second
}, 1000)

useEventListener(window, 'resize', throttledFn)
```

Optionally, you can get the return value of the function using promise operations.

```ts
import { useThrottleFn } from '@vueuse/core'

const throttledFn = useThrottleFn(() => 'response', 1000)

throttledFn().then((value) => {
  console.log(value) // 'response'
})

// or use async/await
async function doRequest() {
  const value = await throttledFn()
  console.log(value) // 'response'
}
```

Since unhandled rejection error is quite annoying when developer doesn't need the return value, the promise will **NOT** be rejected if the function is canceled **by default**. You need to specify the option `rejectOnCancel: true` to capture the rejection.

```ts
import { useThrottleFn } from '@vueuse/core'

const throttledFn = useThrottleFn(() => 'response', 1000, true, true, true)

throttledFn()
  .then((value) => {
    // do something
  })
  .catch(() => {
    // do something when canceled
  })

// calling it again within the throttle window schedules a trailing request
setTimeout(throttledFn, 500)
```

## Cancel

You can cancel any pending trailing execution by calling the `cancel` method.

```ts
import { useThrottleFn } from '@vueuse/core'

const throttledFn = useThrottleFn(() => {
  // do something
}, 1000, true)

throttledFn()
throttledFn()

// Cancel the pending trailing execution before it runs
throttledFn.cancel()
```

## Pending State

You can check if there's a pending trailing execution using the `isPending` ref.

```ts
import { useThrottleFn } from '@vueuse/core'

const throttledFn = useThrottleFn(() => {
  // do something
}, 1000, true)

throttledFn()
throttledFn()
console.log(throttledFn.isPending.value) // true

// After the trailing execution runs or cancel is called
console.log(throttledFn.isPending.value) // false
```

## Flush

You can immediately execute the pending trailing invocation using the `flush` method.

```ts
import { useThrottleFn } from '@vueuse/core'

const throttledFn = useThrottleFn(() => {
  // do something
}, 1000, true)

throttledFn()
throttledFn()

// Execute the pending trailing invocation immediately instead of waiting
throttledFn.flush()
```

## Recommended Reading

- [**Debounce vs Throttle**: Definitive Visual Guide](https://kettanaito.com/blog/debounce-vs-throttle)
