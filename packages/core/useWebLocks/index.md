---
category: Browser
outline: deep
---

# useWebLocks

Reactive [Web Locks API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Locks_API) that automatically releases the lock (request) on scope dispose.

## Usage

```ts
import { isExpectedWebLockRejection, useWebLocks } from '@vueuse/core'

const { isSupported, request } = useWebLocks()
if (isSupported.value) {
  request('lock-name', (signal) => {
    // the lock is held until this callback resolves - check `signal` to see if scope got disposed
    return fetch('/some/resource', { signal }).then(res => res.json() as Record<string, number>)
  }).then((data) => {
    // do something with fetched data - here the lock is released
  }).catch((error) => {
    // useWebLocks rejects locks on scope dispose. You should swallow those expected rejections.
    if (!isExpectedWebLockRejection(error)) {
      throw error
    }
  })
}
```

### Scope Disposal

Lock request always automatically get aborted when the current scope gets disposed.

You can decide what happens with held locks on scope disposal. The default is that they will get rejected:

```ts
import { useWebLocks, useWebLocksAbortScopeDisposed } from '@vueuse/core'
import { promiseTimeout } from '@vueuse/shared'

const { request } = useWebLocks({ forceRelease: true /* the default */ })
request('deadlock', () => {
  return new Promise(() => {
    /* never resolve */
  })
}).catch((error) => {
  // request always gets rejected with error === useWebLocksAbortScopeDisposed
  // does not matter if the request is waiting for the lock or the lock was held
  console.error(error)
})
```

If this is not what you want (i.e. you need to hold the lock until your callback is done), then you can configure the
`useWebLocks` composable with `forceRelease` set to `false`:

```ts
import { useWebLocks, useWebLocksAbortScopeDisposed } from '@vueuse/core'
import { promiseTimeout } from '@vueuse/shared'

const { request } = useWebLocks({ forceRelease: false })
request('long-running', () => {
  return promiseTimeout(10000)
}).then((_) => {
  // the lock gets held for the whole 10 seconds regadles wheter the scope got disposed while the lock was held or not
}).catch((error) => {
  // error === useWebLocksAbortScopeDisposed when lock request could not be fulfilled before scope was disposed
  console.error(error)
})
```

Regardless of the `forceRelease` option, your lock callback does not automatically get terminated when the scope gets disposed.
Use the `signal` parameter that your callback gets passed in to check if you lost the lock:

```ts
import { useWebLocks } from '@vueuse/core'
import { promiseTimeout } from '@vueuse/shared'

const { request } = useWebLocks()
request('long-running', async (signal) => {
  // pass the AbortSignal to asynchronous tasks that support them
  const data = await fetch('/a/resource', { signal })
  await promiseTimeout(1000)
  // manually check if the lock is lost
  signal.throwIfAborted()
})
```

### Lock Request Timeouts

You might want to abort a lock request to e.g. implement a timeout. Use an AbortSignal for that:

```ts
import { useWebLocks } from '@vueuse/core'
import { promiseTimeout } from '@vueuse/shared'

const { request } = useWebLocks()
request('long-running', () => promiseTimeout(10000))
const controller = new AbortController()
setTimeout(() => controller.abort(), 1000)
request('long-running', { signal: controller.signal }, () => {}).catch((error) => {
  // error is an AbortError
  console.error(error)
})
```

The `signal` request option gets only used to abort lock requests.
If the request was granted and the signal aborts, nothing happens with the lock.

When you want to use the signal in the lock, too, you need to manually check it:

```ts
import { useWebLocks } from '@vueuse/core'
import { promiseTimeout } from '@vueuse/shared'

const { request } = useWebLocks()
const controller = new AbortController()
setTimeout(() => controller.abort(), 1000)
request('long-running', { signal: controller.signal }, async () => {
  await promiseTimeout(2000)
  controller.signal.throwIfAborted() // this will abort your lock
})
```

### TypeScript Support

You can pass a mapping of lock names to the return type of their callbacks.
This brings you lock name checking and callback return type checking.

```ts
import { useWebLocks } from '@vueuse/core'

const { request } = useWebLocks<{
  'lock-name-1': Record<string, number>
  'lock-name-2': void
}>()

// @ts-expect-error lock name does not aligns with return type
request('lock-name-2', () => ({ a: 1, b: 2 }))

// @ts-expect-error misspelled lock name
request('lock-name2', () => {})

// @ts-expect-error wrong return type
request('lock-name-2', () => true)
```
