---
category: Component
---

# useTemplateRefsListWrap

Shorthand for binding refs to template elements by string name list

with IDE auto complete and type check.

## Usage

```html
<template>
  <div ref="t1">
    t1
  </div>
  <div ref="t2">
    t2
  </div>
  <div ref="t3">
    t3
  </div>
  <div ref="t4">
    t4
  </div>
  <note>Open the console to see the output</note>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHtmlElementTemplateRefs, useTemplateRefsWrap } from '@vueuse/core'

const useTemplateRefs = useTemplateRefsWrap<HTMLDivElement>()
const { t1, t2, t3 } = useTemplateRefs(['t1', 't2', 't3'])
//  or do it like this
//  const { t1, t2, t3 } = useTemplateRefsWrap<HTMLDivElement>()(['t1', 't2', 't3'])

const { t4, t5 } = useHtmlElementTemplateRefs(['t4', 't5'])

//  Since 't6' is not declared inside the string array, an error will occur.
//  with "Property 't6' does not exist on type"
//  const { t4, t5, t6 } = useHtmlElementTemplateRefs(['t4', 't5', 't6'])

onMounted(() => {
  console.log(t1.value) //  HTMLDivElement
  console.log(t2.value) //  HTMLDivElement
  console.log(t3.value) //  HTMLDivElement
  console.log(t4.value) //  HTMLDivElement
  console.log(t5.value) //  undefinded
})
</script>
```

## Notice

It is recommended not to declare the reference name outside the function parameter. 

Because typescript can't infer name of them.

```typescript
import { useHtmlElementTemplateRefs, useTemplateRefsWrap } from '@vueuse/core'
const refNames = ['t1', 't2', 't3']
const { t1, t2, t3 } = useTemplateRefsWrap<HTMLElement>()(refNames) //  you can use this on vue but can not infer ref names.
```

