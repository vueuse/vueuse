---
category: Component
---

# useTemplateRefsList

Shorthand for binding refs to template elements and components inside `v-for`.

## Usage

```html
<template>
  <div v-for="i of 5" :key="i" :ref="setDiv"></div>
  <MyInput v-for="i of 5" :key="i" :ref="setIpt" />
</template>
<script lang="ts" setup>
import { useTemplateRefsList } from '@vueuse/core'
import type { MyInputApi } from '@/components/MyInput.vue'
import MyInput from '@/components/MyInput.vue'

const [divs, setDiv] = useTemplateRefsList()
// divs: Readonly<Ref<readonly Element[]>>

const [ipts, setIpt] = useTemplateRefsList<MyInputApi>()
// ipts: Readonly<Ref<readonly MyInputApi[]>>

const validateAll = () => {
  ipts.value.forEach(ipt => ipt.validate())
}
</script>
```

In child:

```html
<script lang="ts" setup>
const validate = () => {}

export interface MyInputApi {
  validate: typeof validate
}
defineExpose({
  validate,
})
</script>
```

<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare function useTemplateRefsList<T = Element>(): [
  Readonly<Ref<readonly T[]>>,
  (el: Object | null) => void
]
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/core/useTemplateRefsList/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/core/useTemplateRefsList/index.md)


<!--FOOTER_ENDS-->
