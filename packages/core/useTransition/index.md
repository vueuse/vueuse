---
category: Animation
---

# useTransition

Transition between values

## Usage

```js
import { useTransition, TransitionPresets } from '@vueuse/core'

useTransition(baseNumber, {
  duration: 1000,
  transition: TransitionPresets.easeInOutCubic,
})
```

The following transitions are available via the `TransitionPresets` constant.

- [`linear`](https://cubic-bezier.com/#0,0,1,1)
- [`easeInSine`](https://cubic-bezier.com/#.12,0,.39,0)
- [`easeOutSine`](https://cubic-bezier.com/#.61,1,.88,1)
- [`easeInQuad`](https://cubic-bezier.com/#.11,0,.5,0)
- [`easeOutQuad`](https://cubic-bezier.com/#.5,1,.89,1)
- [`easeInCubic`](https://cubic-bezier.com/#.32,0,.67,0)
- [`easeOutCubic`](https://cubic-bezier.com/#.33,1,.68,1)
- [`easeInOutCubic`](https://cubic-bezier.com/#.65,0,.35,1)
- [`easeInQuart`](https://cubic-bezier.com/#.5,0,.75,0)
- [`easeOutQuart`](https://cubic-bezier.com/#.25,1,.5,1)
- [`easeInOutQuart`](https://cubic-bezier.com/#.76,0,.24,1)
- [`easeInQuint`](https://cubic-bezier.com/#.64,0,.78,0)
- [`easeOutQuint`](https://cubic-bezier.com/#.22,1,.36,1)
- [`easeInOutQuint`](https://cubic-bezier.com/#.83,0,.17,1)
- [`easeInExpo`](https://cubic-bezier.com/#.7,0,.84,0)
- [`easeOutExpo`](https://cubic-bezier.com/#.16,1,.3,1)
- [`easeInOutExpo`](https://cubic-bezier.com/#.87,0,.13,1)
- [`easeInCirc`](https://cubic-bezier.com/#.55,0,1,.45)
- [`easeOutCirc`](https://cubic-bezier.com/#0,.55,.45,1)
- [`easeInOutCirc`](https://cubic-bezier.com/#.85,0,.15,1)
- [`easeInBack`](https://cubic-bezier.com/#0.12,0,0.39,0)
- [`easeOutBack`](https://cubic-bezier.com/#.34,1.56,.64,1)
- [`easeInOutBack`](https://cubic-bezier.com/#.68,-.6,.32,1.6)

Custom transitions can be defined using cubic bezier curves. Transitions defined this way work the same as [CSS easing functions](https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function).

```js
useTransition(baseNumber, {
  duration: 1000,
  transition: [0.75, 0, 0.25, 1],
})
```

For more complex transitions, a custom function can be provided.

```js
const easeOutElastic = (n) => {
  return n === 0
    ? 0
    : n === 1
      ? 1
      : (2 ** (-10 * n)) * Math.sin((n * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
}

useTransition(baseNumber, {
  duration: 1000,
  transition: easeOutElastic,
})
```

To choreograph behavior around a transition, define `onStarted` or `onFinished` callbacks.

```js
useTransition(baseNumber, {
  duration: 1000,
  transition: easeOutElastic,
  onStarted() {
    // called after the transition starts
  },
  onFinished() {
    // called after the transition ends
  },
})
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Cubic bezier points
 */
declare type CubicBezierPoints = [number, number, number, number]
/**
 * Easing function
 */
declare type EasingFunction = (n: number) => number
/**
 * Transition options
 */
interface TransitionOptions {
  duration?: MaybeRef<number>
  onFinished?: () => unknown
  onStarted?: () => unknown
  transition?: MaybeRef<EasingFunction | CubicBezierPoints>
}
/**
 * Common transitions
 *
 * @link https://easings.net
 */
export declare const TransitionPresets: Record<string, CubicBezierPoints>
/**
 * Transition between values.
 *
 * @link https://vueuse.org/useTransition
 * @param source
 * @param options
 */
export declare function useTransition(
  source: Ref<number>,
  options?: TransitionOptions
): Ref<number>
export {}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useTransition/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useTransition/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useTransition/index.md)


<!--FOOTER_ENDS-->
