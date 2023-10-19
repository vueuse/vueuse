---
category: '@RxJS'
---

# useExtractedObservable

Use an RxJS [`Observable`](https://rxjs.dev/guide/observable) as extracted from one or more composables, return a `ref`,
and automatically unsubscribe from it when the component is unmounted.

Automatically unsubscribe on observable change, and automatically unsubscribe from it when the component is unmounted.

Supports signatures that match all overloads
of [`watch`](https://vuejs.org/guide/essentials/watchers.html#basic-example).

## Usage

```ts
import { computed } from 'vue'
import { useExtractedObservable } from '@vueuse/rxjs'
import ObservableSocket from 'observable-socket'
import { makeSocket, useUser } from '../some/lib/func'

// setup()
const user = useUser()
const lastMessage = useExtractedObservable(user, u => ObservableSocket.create(makeSocket(u.id)).down)
```

If you want to add custom error handling to an `Observable` that might error, you can supply an optional `onError`
configuration. Without this, RxJS will treat any error in the supplied `Observable` as an "unhandled error" and it will
be thrown in a new call stack and reported to `window.onerror` (or `process.on('error')` if you happen to be in Node).

```ts
import { ref } from 'vue'
import { useExtractedObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, scan, startWith, tap } from 'rxjs/operators'

// setup()
const start = ref(0)

const count = useExtractedObservable(
  start,
  (start) => {
    return interval(1000).pipe(
      mapTo(1),
      startWith(start),
      scan((total, next) => next + total),
      tap((n) => {
        if (n === 10)
          throw new Error('oops')
      })
    )
  },
  {
    onError: (err) => {
      console.log(err.message) // "oops"
    },
  }
)
```

You can also supply an optional `onComplete` configuration if you need to attach special behavior when the watched
observable completes.

```ts
import { ref } from 'vue'
import { useExtractedObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, scan, startWith, takeWhile } from 'rxjs/operators'

// setup()
const start = ref(0)

const count = useExtractedObservable(
  start,
  (start) => {
    return interval(1000).pipe(
      mapTo(1),
      startWith(start),
      scan((total, next) => next + total),
      takeWhile(num => num < 10)
    )
  },
  {
    onComplete: () => {
      console.log('Done!')
    },
  }
)
```

If you want, you can also pass `watch` options as the last argument:

```ts
import { ref } from 'vue'
import { useExtractedObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, scan, startWith, takeWhile } from 'rxjs/operators'

// setup()
const start = ref<number>()

const count = useExtractedObservable(
  start,
  (start) => {
    return interval(1000).pipe(
      mapTo(1),
      startWith(start),
      scan((total, next) => next + total),
      takeWhile(num => num < 10)
    )
  },
  {},
  {
    immediate: false
  }
)
```
