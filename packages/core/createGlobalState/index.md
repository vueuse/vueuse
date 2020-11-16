# createGlobalState

> Keep states in the global scope to be reusable across Vue instances.

## Usage

```js
// store.js
import { createGlobalState, useStorage } from '@vueuse/core'

export const useGlobalState = createGlobalState(
  () => useStorage('vue-use-locale-storage'),
)
```

```js
// component.js
import { useGlobalState } from './store'

export default defineComponent({
  setup() {
    const state = useGlobalState()
    return { state }
  },
})
```
