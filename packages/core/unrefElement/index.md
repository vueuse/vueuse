---
category: Component
---

# unrefElement

Retrieves the underlying DOM element from a Vue ref or component instance

## Usage

```html
<template>
  <div ref="div"/>
  <HelloWorld ref="hello"/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { unrefElement } from '@vueuse/core'

const div = ref() // will be bound to the <div> element
const hello = ref() // will be bound to the HelloWorld Component

onMounted(() => {
  console.log(unrefElement(div)) // the <div> element
  console.log(unrefElement(hello)) // the root element of the HelloWorld Component
})
</script>
```
