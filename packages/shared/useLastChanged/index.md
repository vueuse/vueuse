---
category: Utilities
---

# useLastChanged

Records the timestamp of the last change

## Usage

```ts
import { useLastChanged } from '@vueuse/core'

const a = ref(0)

const lastChanged = useLastChanged(a)

a.value = 1

console.log(lastChanged.value)
```

<!--FOOTER_STARTS-->


## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/shared/useLastChanged/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/shared/useLastChanged/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/shared/useLastChanged/index.md)


<!--FOOTER_ENDS-->
