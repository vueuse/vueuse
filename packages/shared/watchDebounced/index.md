---
category: Watch
alias: debouncedWatch
---

# watchDebounced

Debounced watch

## Usage

Similar to `watch`, but offering an extra option `debounce` which will be applied to the callback function.

```ts
import { watchDebounced } from '@vueuse/core'

watchDebounced(
  source,
  () => { console.log('changed!') },
  { debounce: 500 }
)
```

It's essentially a shorthand for the following code:

```ts
import { watchWithFilter, debounceFilter } from '@vueuse/core'

watchWithFilter(
  source,
  () => { console.log('changed!') },
  {
    eventFilter: debounceFilter(500),
  }
)
```
