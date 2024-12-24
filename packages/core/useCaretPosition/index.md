---
category: Unknown
---

# useCaretPosition

The `useCaretPosition` composable provides a simple way to track and manage the caret position

::: warning
`useCaretPosition` only works with text input elements (`HTMLInputElement`).
:::

## Usage

```vue
<script setup lang="ts">
import { useCaretPosition } from '@vueuse/core'
import { shallowRef } from 'vue'

const el = shallowRef<HTMLInputElement>()

const { position } = useCaretPosition(el)

position.value = 3
</script>

<template>
  <input ref="el" type="text" value="vueuse">
</template>
```
