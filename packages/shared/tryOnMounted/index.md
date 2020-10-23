# tryOnMounted

> Safe `onMounted`. Call `onMounted()` if it's inside a component lifecycle, if not, run just call the function

## Usage

```jsx
import { tryOnMounted } from '@vueuse/core'

// same as `onMounted`
tryOnMounted(() => {

})
```
