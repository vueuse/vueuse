---
category: Animation
---

# useRafFn

> Call function on every `requestAnimationFrame`. With controls of pausing and resuming.

## Usage

```js
import { useRafFn } from '@vueuse/core'

const { pause, resume } = useRafFn((elapsed) => {
  console.log(elapsed.value)
})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface RafFnOptions extends ConfigurableWindow {
  /**
   * Start the requestAnimationFrame loop immediately on creation
   *
   * @default true
   */
  immediate?: boolean
}
export interface RafFnReturn extends Pausable {
  /**
   * @deprecated use pause() instead
   */
  stop: Fn
  /**
   * @deprecated use resume() instead
   */
  start: Fn
}
/**
 * Call function on every `requestAnimationFrame`. With controls of pausing and resuming.
 *
 * @see   {@link https://vueuse.js.org/useRafFn}
 * @param fn
 * @param options
 */
export declare function useRafFn(fn: Fn, options?: RafFnOptions): RafFnReturn
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/useRafFn/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/core/useRafFn/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/useRafFn/index.md)


<!--FOOTER_ENDS-->