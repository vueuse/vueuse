---
category: Utilities
---

# useAsyncState

> Reactive async state. Will not block your setup function and will triggers changes once the promise is ready.

## Usage

```ts
import axios from 'axios'
import { useAsyncState } from '@vueuse/core'

const { state, ready } = useAsyncState(
  axios
    .get('https://jsonplaceholder.typicode.com/todos/1')
    .then(t => t.data),
  { id: null },
)
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Reactive async state. Will not block your setup function and will triggers changes once
 * the promise is ready.
 *
 * @see   {@link https://vueuse.js.org/useAsyncState}
 * @param promise         The promise / async function to be resolved
 * @param initialState    The initial state, used until the first evaluation finishes
 * @param delay           Delay (ms)
 * @param catchFn         Error handling callback
 */
export declare function useAsyncState<T>(
  promise: Promise<T>,
  initialState: T,
  delay?: number,
  catchFn?: (e: Error) => void
): {
  state: Ref<UnwrapRef<T>>
  ready: Ref<boolean>
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/master/packages/core/useAsyncState/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/master/packages/core/useAsyncState/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/master/packages/core/useAsyncState/index.md)


<!--FOOTER_ENDS-->