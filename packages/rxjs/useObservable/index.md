<!--DEMO_STARTS-->
<script setup>
import Demo from './demo.vue'
</script>
<DemoContainer><Demo/></DemoContainer>
<!--DEMO_ENDS-->

<!--HEAD_STARTS-->
📦 this function is available in [`@vueuse/rxjs`](/?path=/story/rxjs--readme)


<!--HEAD_ENDS-->


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


<!--FOOTER_STARTS-->
## Typing

```typescript
export declare function useObservable<H>(
  observable: Observable<H>
): Readonly<Ref<H>>
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/rxjs/useObservable/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/rxjs/useObservable/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/rxjs/useObservable/index.md)


<!--FOOTER_ENDS-->