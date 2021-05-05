---
category: Animation
---

# useOneWayTransition

One-way transition between values


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
declare type TransitionTiming =
  | [number, number, number, number]
  | ((n: number) => number)
/**
 * One-way transition options
 */
declare type OneWayTransitionOptions = {
  /**
   * Default transition duration in milliseconds
   */
  duration?: number
  /**
   * Default transition timing function
   */
  transition?: TransitionTiming
}
/**
 * Transition options
 */
declare type TransitionOptions<T, U = T extends number ? number : number[]> = {
  /**
   * Transition duration in milliseconds
   */
  duration?: number
  /**
   * Transition start value
   */
  from: U
  /**
   * Transition end value
   */
  to: U
  /**
   * Transition timing function
   */
  transition?: TransitionTiming
}
/**
 * One-way transition between values.
 */
export declare function useOneWayTransition<T extends number | number[]>(
  initialValue: T,
  defaultOptions?: OneWayTransitionOptions
): {
  transition: (options: TransitionOptions<T>) => Promise<void>
  value: ComputedRef<number | number[]>
}
export {}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useOneWayTransition/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useOneWayTransition/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useOneWayTransition/index.md)


<!--FOOTER_ENDS-->
