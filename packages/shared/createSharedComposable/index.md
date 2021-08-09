---
category: State
---

# createSharedComposable

Make a composable function usable with multiple Vue instances.

## Usage

```ts
import { createSharedComposable, useMouse } from '@vueuse/core'

const useSharedMouse = createSharedComposable(useMouse)

// CompA.vue
const { x, y } = useSharedMouse()

// CompB.vue - will reuse the previous state and no new event listeners will be registered
const { x, y } = useSharedMouse()
```

## Related

- `createGlobalState`

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Make a composable function usable with multiple Vue instances.
 *
 * @see https://vueuse.org/createSharedComposable
 */
export declare function createSharedComposable<
  Fn extends (...args: any[]) => any
>(composable: Fn): Fn
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/shared/createSharedComposable/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/shared/createSharedComposable/index.md)


<!--FOOTER_ENDS-->
