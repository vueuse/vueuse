---
category: Browser
---

# useCustomHighlight

Reactive CSS Custom Highlight API.

## Usage

```ts
import { ref } from 'vue'
import { useCustomHighlight } from '@vueuse/core'

const el = ref<HTMLElement>()
const word = ref('foo')
const { isSupported, update } = useCustomHighlight(el, word, {
  name: 'custom-highlight-name',
})
```
