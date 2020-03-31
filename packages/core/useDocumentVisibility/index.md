# useDocumentVisibility

> Reactively track [`Document.visibilityState`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilityState)

## Usage

```js
import { useDocumentVisibility } from '@vueuse/core'

export default {
  setup() {
    const visibility = useDocumentVisibility()
  },
}
```
