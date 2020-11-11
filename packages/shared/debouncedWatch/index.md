# debouncedWatch

> Debounced watch

## Usage

Similar to `watch`, but offering an extra option `debounce` which will be applied to the callback function.

```ts
import { debouncedWatch } from '@vueuse/core'

debouncedWatch(
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
