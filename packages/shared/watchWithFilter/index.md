# watchWithFilter

> `watch` with additional EventFilter control.

## Usage

Similar to `watch`, but offering an extra option `eventFilter` which will be applied to the callback function.

```ts
import { watchWithFilter, debounceFilter } from '@vueuse/core'

watchWithFilter(
  source,
  () => { console.log('changed!') }, // callback will be called in 500ms debounced manner 
  {
    eventFilter: debounceFilter(500), // throttledFilter, pausabledFilter or custom filters
  }
)
```
