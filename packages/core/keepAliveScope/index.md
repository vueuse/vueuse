---
category: Reactivity
---

# keepAliveScope

Creates a [scope](https://vuejs.org/api/reactivity-advanced.html#effectscope) that is disposed when the component is deactivated.

Its purpose is to avoid additional processing while the keep alived component is deactivated.

## Usage

```js
import { keepAliveScope, useEventListener } from '@vueuse/core'

keepAliveScope(() => {
  // listen to scroll event only if the component is not deacivated
  useEventListener('scroll', () => {
    // ...
  })
})
```
