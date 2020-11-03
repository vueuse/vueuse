# useObservable

> Use an Observable, return a ref and automatically unsubscribe from it when the component is unmounted.

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
