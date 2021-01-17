---
category: Animation
---

# useTimeout

> Update value after a given time with controls.

## Usage

```js
import { useTimeout, promiseTimeout } from '@vueuse/core'

const { ready, start, stop } = useTimeout(1000, true)
```

```js
console.log(ready.value) // false

await promisedTimeout(1200)

console.log(ready.value) // true
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Update value after a given time with controls.
 *
 * @param interval
 * @param immediate
 */
export declare function useTimeout(
  interval?: number,
  immediate?: boolean
): {
  ready: Ref<boolean>
  isActive: Ref<boolean>
  start: () => void
  stop: () => void
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/shared/useTimeout/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/shared/useTimeout/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/shared/useTimeout/index.md)


<!--FOOTER_ENDS-->