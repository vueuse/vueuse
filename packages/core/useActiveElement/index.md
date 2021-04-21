---
category: Browser
---

# useActiveElement

Reactive `document.activeElement`

## Usage

```js
import { useActiveElement } from '@vueuse/core'

const activeElement = useActiveElement()

watch(activeElement, (el) => {
  console.log('focus changed to', el)
})
```

<!--FOOTER_STARTS-->


## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useActiveElement/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useActiveElement/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useActiveElement/index.md)


<!--FOOTER_ENDS-->
