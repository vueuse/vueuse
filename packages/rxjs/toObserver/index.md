---
category: '@RxJS'
---

# toObserver

Sugar function to convert a ref in an observer

## Usage

```ts
import { ref } from 'vue'
import { toObserver, fromEvent, from } from '@vueuse/rxjs'
import { interval } from 'rxjs'
import { mapTo, takeUntil, withLatestFrom, map } from 'rxjs/operators'

const count = ref(0)
const button = ref<HTMLButtonElement>(null)

useSubscription(
  interval(1000)
    .pipe(
      mapTo(1),
      takeUntil(fromEvent(button, 'click')),
      withLatestFrom(from(count).pipe(startWith(0))),
      map(([total, curr]) => curr + total),
    )
    .subscribe(toObserver(count)) // same as ).subscribe(val => (count.value = val))
) 
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare function toObserver<T>(value: Ref<T>): NextObserver<T>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/rxjs/toObserver/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/rxjs/toObserver/index.md)


<!--FOOTER_ENDS-->
