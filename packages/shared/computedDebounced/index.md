---
category: Reactivity
---

# computedDebounced

Debounce updates of a computed value.

A computed that depends on other reactive state, but only updates after that other state has stopped changing for a certain time.

## Usage

```ts
import { computedDebounced } from '@vueuse/core'

const inputText = ref('')
const preview = computedDebounced(
  () => generatePreview(inputText.value),
  1000,
)

watchEffect(() => {
  // Only runs after the input has been idle for 1000ms.
  renderPreview(preview.value)
})
```

## Description

`computedDebounced` is like `refDebounced` for computed getters: the initial value is computed eagerly, and subsequent updates only happen after the reactive dependencies have stopped changing for the debounce delay.

Compared to the `watchDebounced` workaround, it stays declarative and works naturally inside other computeds and templates.

| | Behavior |
|---|---|
| Initial value | Computed synchronously, no delay |
| Subsequent updates | Debounced (trailing edge) |
| Rapid changes | Merged into a single update |

## Options

The third argument accepts both debounce options and watch options:

```ts
computedDebounced(() => value, 1000, { maxWait: 5000, flush: 'post' })
```

- `maxWait` — the maximum time the debounced update is allowed to be delayed, in milliseconds. The getter itself may still run earlier as its reactive dependencies change.
- `flush` — the flush timing of the underlying watch, see [Vue watch options](https://vuejs.org/api/reactivity-core#watch).

## Type Declarations

```ts
export type ComputedDebouncedOptions = DebounceFilterOptions & WatchOptionsBase

export declare function computedDebounced<T>(
  getter: () => T,
  ms?: MaybeRefOrGetter<number>,
  options?: ComputedDebouncedOptions,
): Readonly<Ref<T>>
```
