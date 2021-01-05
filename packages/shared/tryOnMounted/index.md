---
category: Component
---

<!--DEMO_STARTS--><!--DEMO_ENDS-->

<!--HEAD_STARTS--><!--HEAD_ENDS-->

# tryOnMounted

> Safe `onMounted`. Call `onMounted()` if it's inside a component lifecycle, if not, run just call the function

## Usage

```js
import { tryOnMounted } from '@vueuse/core'

tryOnMounted(() => {

})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Call onMounted() if it's inside a component lifecycle, if not, run just call the function
 *
 * @param fn
 * @param sync if set to false, it will run in the nextTick() of Vue
 */
export declare function tryOnMounted(fn: Fn, sync?: boolean): void
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/shared/tryOnMounted/index.ts) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/shared/tryOnMounted/index.md)


<!--FOOTER_ENDS-->