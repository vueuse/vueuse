---
category: Component
---

# tryOnMounted

Safe `onMounted`. Call `onMounted()` if it's inside a component lifecycle, if not, run just call the function

## Usage

```js
import { tryOnMounted } from '@vueuse/core'

tryOnMounted(() => {

})
```
