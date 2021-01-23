---
category: Animation
---

# useTimestamp

Reactive current timestamp

## Usage

```js
import { useTimestamp } from '@vueuse/core'

const { timestamp, pause, resume } = useTimestamp({ offset: 0 })
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface TimestampOptions {
  /**
   * Offset value adding to the value
   *
   * @default 0
   */
  offset?: number
}
/**
 * Reactive current timestamp.
 *
 * @see   {@link https://vueuse.js.org/useTimestamp}
 * @param options
 */
export declare function useTimestamp(
  options?: TimestampOptions
): {
  stop: Fn
  start: Fn
  isActive: Ref<boolean>
  pause: Fn
  resume: Fn
  timestamp: Ref<number>
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/useTimestamp/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/core/useTimestamp/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/useTimestamp/index.md)


<!--FOOTER_ENDS-->