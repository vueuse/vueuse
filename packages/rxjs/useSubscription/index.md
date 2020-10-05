# useSubscription

> Uses subscriptions without worry about unsubscribing to it or memory leaks.

## Usage

```ts{0}
import { useSubscription } from '@vueuse/rxjs'
import { interval } from 'rxjs'

const count = ref(0)
// useSubscription call unsubscribe method before unmount the component
useSubscription(
  interval(1000)
    .subscribe(() => {
      count.value++
      console.log(count)
    })
)
```
