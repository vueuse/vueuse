---
category: Component
---

# useVForRefs

Shorthand for v-for Array Refs.

## Usage

```html
<template>
  <template v-for="item in list" :key="item.id">
    <div :ref="setRef">{{ item.value }}</div>
  </template>
</template>

<script lang="ts">
import { onMounted } from 'vue-demi'
import { useVForRefs } from '@vueuse/core'

export default {
  setup() {
    const list = [{ id: 0, value: 'foo' }, { id: 1, value: 'bar' }]
    const { refs, setRef } = useVForRefs()

    onMounted(() => {
      console.log(refs) // the <div> elements
    })

    return { list, setRef }
  }
}
</script>
```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare function useVForRefs(): {
  refs: Element[]
  setRef: (el: Element) => void
}
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useVForRefs/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useVForRefs/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useVForRefs/index.md)


<!--FOOTER_ENDS-->
