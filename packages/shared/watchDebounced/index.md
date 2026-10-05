---
category: Watch
alias: debouncedWatch
---

# watchDebounced

Debounced watch. The callback will only be invoked after the source stops changing for the specified duration.

## Usage

Similar to `watch`, but offering extra options `debounce` and `maxWait` which will be applied to the callback function.

```ts
import { watchDebounced } from '@vueuse/core'

watchDebounced(
  source,
  () => { console.log('changed!') },
  { debounce: 500, maxWait: 1000 },
)
```

### Options

| Option     | Type                       | Default | Description                                |
| ---------- | -------------------------- | ------- | ------------------------------------------ |
| `debounce` | `MaybeRefOrGetter<number>` | `0`     | Debounce delay in ms (can be reactive)     |
| `maxWait`  | `MaybeRefOrGetter<number>` | —       | Maximum wait time before forced invocation |

All standard `watch` options (`deep`, `immediate`, `flush`, etc.) are also supported.

### Reactive Debounce Time

The debounce time can be reactive:

```ts
import { watchDebounced } from '@vueuse/core'

const debounceMs = ref(500)

watchDebounced(
  source,
  () => { console.log('changed!') },
  { debounce: debounceMs },
)

// Later, change the debounce time
debounceMs.value = 1000
```

### Async callbacks

`debounce` and `maxWait` control when the callback runs; they do not cancel asynchronous work that the callback has already started. An earlier request can still complete after a later one and overwrite newer state.

For a latest-result-wins UI, cancel obsolete requests where supported and guard state updates so only current work can commit. Invalidate previous work when the watched source changes, including while the next callback is waiting for the debounce delay.

See [async race conditions and stale UI updates](https://frontendatlas.com/javascript/trivia/js-async-race-conditions) for cancellation and request-ownership examples.

## How It Works

It's essentially a shorthand for the following code:

```ts
import { debounceFilter, watchWithFilter } from '@vueuse/core'

watchWithFilter(
  source,
  () => { console.log('changed!') },
  {
    eventFilter: debounceFilter(500, { maxWait: 1000 }),
  },
)
```
