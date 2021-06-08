---
category: '@RxJS'
---

# useObservable

Use an Observable, return a ref and automatically unsubscribe from it when the component is unmounted. It also returns an `onError` hook registration point that can be used to register 
handlers for errors that are emitted by the observable.

## Usage

```ts
import { ref } from 'vue'
import { useObservable } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, startWith, scan } from 'rxjs/operators'

// setup()
const { out: count, onError } = useObservable(
  interval(1000).pipe(
    mapTo(1),
    startWith(0),
    scan((total, next) => next + total),
  )
)

// Optional
onError(err => {
  console.log('An error occurred in the observable')
})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare function useObservable<H>(
  observable: Observable<H>
): {
  out: Readonly<Ref<H>>;
  onError: (cb: (error: any) => void) => void;
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/rxjs/useObservable/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/rxjs/useObservable/index.md)


<!--FOOTER_ENDS-->
