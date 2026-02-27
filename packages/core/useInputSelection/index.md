---
category: Unknown
---

# useInputSelection

Reactive selection state of an input element.

::: warning
[`onselectionchange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/selectionchange_event) for
inputs is still an experimental browser feature. It may have different behaviors across different
browsers. (e.g. Chrome will fire `onselectionchange` event when the input is
mounted ([Chromium Issue](https://issues.chromium.org/issues/389368412)), leading to unexpected initial values)
:::

## Usage

```vue
<script setup lang="ts">
import { useInputSelection } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const input = useTemplateRef('input')

const { start, end, direction } = useInputSelection(input)
</script>

<template>
  <input ref="input" type="text" placeholder="Type here">
</template>
```
