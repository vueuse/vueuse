---
category: Browser
---

# usePrint

Reactive [Printing](https://developer.mozilla.org/en-US/docs/Web/Guide/Printing) API. It adds methods to open the browser print dialog, in current page, to print from an url or an html string.

## Usage

```html
<div>
  <textarea v-model="source" />
  <button @click="() => printSource()">Print Source</button>
</div>
```

```js
import { ref } from 'vue'
import { usePrint } from '@vueuse/core'

export default {
  setup() {
    const source = ref('<h1>Hello vueuse!</h1>')

    const { printSource, printUrl } = usePrint(source)

    return {
      source,
      printSource,
    }
  },
}
```
