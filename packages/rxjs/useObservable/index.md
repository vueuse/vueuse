---
category: '@RxJS'
---

# useObservable

Use an Observable, return a ref and automatically unsubscribe from it when the component is unmounted.

## Usage

```ts
import { ref } from 'vue'
import { useObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, startWith, scan } from 'rxjs/operators'

// setup()
const count = useObservable(
  interval(1000).pipe(
    mapTo(1),
    startWith(0),
    scan((total, next) => next + total),
  )
)
```

If you want to add custom error handling to an observable that might error, you can supply an optional `onError` configuration. Without this, RxJS will treat any error in the supplied observable as an "unhandled error" and it will be thrown in a new call stack and reported to `window.onerror` (or `process.on('error')` if you happen to be in node).

```ts
import { ref } from 'vue'
import { useObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { map } from 'rxjs/operators'

// setup()
const count = useObservable(
  interval(1000).pipe(
    map(n => {
      if (n === 10) {
        throw new Error('oops')
      }
      return n + n
    })
  ),
  {
    onError: err => {
      console.log(err.message) // "oops"
    }
  }
)
```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface UseObservableOptions {
  onError?: (err: any) => void
}
export declare function useObservable<H>(
  observable: Observable<H>,
  options?: UseObservableOptions
): Readonly<Ref<H>>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/rxjs/useObservable/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/rxjs/useObservable/index.md)


<!--FOOTER_ENDS-->
