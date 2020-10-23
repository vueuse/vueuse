# tryOnUnmounted

> Safe `onUnmounted`. Call `onUnmounted()` if it's inside a component lifecycle, if not, do nothing

## Usage

```jsx
import { tryOnUnmounted } from '@vueuse/core'

// same as `onUnmounted`
tryOnUnmounted(() => {

})
```
