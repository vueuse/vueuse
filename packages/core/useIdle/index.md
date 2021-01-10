---
category: Sensors
---


# useIdle

> Tracks whether the user is being inactive.

## Usage

```js
import { useIdle } from '@vueuse/core'

const { idle, lastActive } = useIdle(5 * 60 * 1000) // 5 min

console.log(idle.value) // true or false
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface IdleOptions
  extends ConfigurableWindow,
    ConfigurableEventFilter {
  /**
   * Event names that listen to for detected user activity
   *
   * @default ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel']
   */
  events?: WindowEventName[]
  /**
   * Listen for document visibility change
   *
   * @default true
   */
  listenForVisibilityChange?: boolean
  /**
   * Initial state of the ref idle
   *
   * @default false
   */
  initialState?: boolean
}
/**
 * Tracks whether the user is being inactive.
 *
 * @see   {@link https://vueuse.js.org/useIdle}
 * @param timeout default to 1 minute
 * @param options IdleOptions
 */
export declare function useIdle(
  timeout?: number,
  options?: IdleOptions
): {
  idle: Ref<boolean>
  lastActive: Ref<number>
}
```

## Source

[Source](https://github.com/antfu/vueuse/blob/master/packages/core/useIdle/index.ts) • [Demo](https://github.com/antfu/vueuse/blob/master/packages/core/useIdle/demo.vue) • [Docs](https://github.com/antfu/vueuse/blob/master/packages/core/useIdle/index.md)


<!--FOOTER_ENDS-->
