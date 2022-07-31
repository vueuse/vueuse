---
category: Utilities
---

# useObjectTemplate

Using reactive ref to form template.

## Usage

```ts
import { useObjectTemplate } from '@vueuse/core/useObjectTemplate'

const originData = ref({
  key: 'value'
})

const {
  template,
  reset
} = useObjectTemplate(originData)

template.value = 'changedValue'

reset()
```
