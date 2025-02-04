---
category: Elements
---

# useActiveElement

Reactive `document.activeElement`

## Usage

```ts
import { useActiveElement } from '@vueuse/core'

const activeElement = useActiveElement()

watch(activeElement, (el) => {
  console.log('focus changed to', el)
})
```

## Component Usage

```vue
<template>
  <UseActiveElement v-slot="{ element }">
    Active element is {{ element.dataset.id }}
  </UseActiveElement>
</template>
```
