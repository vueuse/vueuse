---
category: Component
---

# useTemplateRefsList

Shorthand for binding refs to template elements and components inside `v-for`.

> This function only works for Vue 3.x.

## Usage

```html
<template>
  <div v-for="i of 5" :key="i" :ref="refs.set"></div>
</template>

<script setup lang="ts">
import { onUpdated } from 'vue'
import { useTemplateRefsList } from '@vueuse/core'

const refs = useTemplateRefsList<HTMLDivElement>()

onUpdated(() => {
  console.log(refs)
})
</script>
```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare type TemplateRefsList<T> = T[] & {
  set(el: Object | null): void
}
export declare function useTemplateRefsList<T = Element>(): Readonly<
  Ref<Readonly<TemplateRefsList<T>>>
>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useTemplateRefsList/index.ts) • [Demo](https://github.com/vueuse/vueuse/blob/main/packages/core/useTemplateRefsList/demo.vue) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useTemplateRefsList/index.md)


<!--FOOTER_ENDS-->
