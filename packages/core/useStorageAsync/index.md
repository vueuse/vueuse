---
category: State
---

# useStorageAsync

Reactive Storage in with async support.

## Usage

The basic usage please refer to `useStorage`.

## Wait First Loaded

When user entering your app, `useStorageAsync()` will start loading value from an async storage,
sometimes you may get the default initial value, not the real value stored in storage at the very
beginning.

In this case, you must make your app wait the storage prepared, the options contains an `onReady`
callback, you can use promise to block app initialising.

```ts
import { useStorageAsync } from '@vueuse/core'

// Use ES2024 Promise.withResolvers, you may use any Deferred object or EventBus to do same thing.
const { promise, resolve } = Promise.withResolvers()

const accessToken = useStorageAsync('access.token', '', SomeAsyncStorage, {
  onReady(value) {
    resolve(value)
  }
})

// At main.ts
router.onReady(async () => {
  // Here accessToken may be the default initial value, not the value really stored in storage.
  console.log(accessToken.value)

  // Let's wait accessToken loaded
  await promise

  // Now accessToken has loaded, we can safely mount our app

  app.mount('app')
})
```

You can simply use `resolve` as callback:

```ts
const accessToken = useStorageAsync('access.token', '', SomeAsyncStorage, {
  onReady: resolve
})
```

Another way, use reactive variable with `until()`

```ts
import { until } from '@vueuse/core'

const isLoaded = ref(false)

const accessToken = useStorageAsync('access.token', '', SomeAsyncStorage, {
  onReady(value) {
    isLoaded.value = true
  }
})

// ...

await until(isLoaded).toBe(true)
```

If you must wait multiple storages, use `Promise.all()`

```ts
router.onReady(async () => {
  await Promise.all([
    accessTokenPromise,
    refreshTokenPromise,
    userDataPromise,
  ])

  app.mount('app')
})
```
