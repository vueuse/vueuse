---
category: Utilities
---

<!--DEMO_STARTS-->
<script setup>
import Demo from './demo.vue'
</script>
<DemoContainer><Demo/></DemoContainer>
<!--DEMO_ENDS-->

<!--HEAD_STARTS--><!--HEAD_ENDS-->


# useCounter

> Basic counter with utility functions.

## Usage

```js
import { useCounter } from '@vueuse/core'

const { count, inc, dec, set, reset } = useCounter()
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Basic counter with utility functions.
 *
 * @see   {@link https://vueuse.js.org/useCounter}
 * @param [initialValue=0]
 */
export declare function useCounter(
  initialValue?: number
): {
  count: Ref<number>
  inc: (delta?: number) => number
  dec: (delta?: number) => number
  get: () => number
  set: (val: number) => number
  reset: (val?: number) => number
}
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/shared/useCounter/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/shared/useCounter/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/shared/useCounter/index.md)


<!--FOOTER_ENDS-->