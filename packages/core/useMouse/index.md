---
category: Sensors
---

# useMouse

> Reactive mouse position

## Basic Usage

```js
import { useMouse } from '@vueuse/core'

const { x, y, source } = useMouse()
```

Touching is enabled by default. To make it only detects mouse changes, set `touch` to `false`

```js
const { x, y } = useMouse({ touch: false })
```



<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface MouseOptions extends ConfigurableWindow {
  /**
   * Listen to `touchmove` events
   *
   * @default true
   */
  touch?: boolean
  /**
   * Reset to initial value when `touchend` event fired
   *
   * @default false
   */
  resetOnTouchEnds?: boolean
  /**
   * Initial values
   */
  initialValue?: {
    x: number
    y: number
  }
}
export declare type MouseSourceType = "mouse" | "touch" | null
/**
 * Reactive mouse position.
 *
 * @see   {@link https://vueuse.js.org/useMouse}
 * @param options
 */
export declare function useMouse(
  options?: MouseOptions
): {
  x: Ref<number>
  y: Ref<number>
  sourceType: Ref<MouseSourceType>
}
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/useMouse/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/core/useMouse/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/useMouse/index.md)


<!--FOOTER_ENDS-->