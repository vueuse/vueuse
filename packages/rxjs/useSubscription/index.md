<!--DEMO_STARTS-->
<script setup>
import Demo from './demo.vue'
</script>
<DemoContainer><Demo/></DemoContainer>
<!--DEMO_ENDS-->

<!--HEAD_STARTS-->
📦 this function is available in [`@vueuse/rxjs`](/?path=/story/rxjs--readme)


<!--HEAD_ENDS-->


# useSubscription

> Uses subscriptions without worry about unsubscribing to it or memory leaks.

## Usage

```ts
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


<!--FOOTER_STARTS-->
## Typing

```typescript
export declare function useSubscription(subscription: Unsubscribable): void
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/rxjs/useSubscription/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/rxjs/useSubscription/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/rxjs/useSubscription/index.md)


<!--FOOTER_ENDS-->