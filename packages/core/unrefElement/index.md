---
category: Component
---

# unrefElement

Retrieves the underlying DOM element from a Vue ref or component instance

## Usage

```vue
<script setup>
import { unrefElement } from '@vueuse/core'
import { onMounted, ref } from 'vue'

const div = ref() // will be bound to the <div> element
const hello = ref() // will be bound to the HelloWorld Component

onMounted(() => {
  console.log(unrefElement(div)) // the <div> element
  console.log(unrefElement(hello)) // the root element of the HelloWorld Component
})
</script>

<template>
  <div ref="div" />
  <HelloWorld ref="hello" />
</template>
```
