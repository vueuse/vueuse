---
category: Reactivity
---

# conditionalScope

Creates a conditional scope that is disposed when the conditions are not met.

## Usage

```ts
import { conditionalScope, useEventListener } from '@vueuse/core'

const props = defineProps<{ disabled?: boolean }>()

conditionalScope(() => !props.disabled, () => {
  // listen to scroll event, only if `props.disabled` is falsy.
  useEventListener('scroll', () => {
    // ...
  })

  // watch language ref, only if `props.disabled` is falsy.
  watch(language, (lang) => {
    // ...
  })
})
```
