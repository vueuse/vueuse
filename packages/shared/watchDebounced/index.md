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
