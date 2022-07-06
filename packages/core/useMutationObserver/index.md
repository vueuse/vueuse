---
category: Elements
---

# useMutationObserver

Watch for changes being made to the DOM tree. [MutationObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)

## Usage

```ts
import { ref } from 'vue'
import { useMutationObserver } from '@vueuse/core'

export default {
  setup() {
    const el = ref(null)
    const messages = ref([])

    useMutationObserver(el, (mutations) => {
      if (mutations[0])
        messages.value.push(mutations[0].attributeName)
    }, {
      attributes: true,
    })

    return {
      el,
      messages,
    }
  },
}
```
