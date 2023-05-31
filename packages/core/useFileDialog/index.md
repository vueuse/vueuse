---
category: Browser
---

# useFileDialog

Open file dialog with ease.

## Usage

```ts
import { useFileDialog } from '@vueuse/core'

const { files, open, reset, onChange } = useFileDialog()

onChange((files) => {
  /** do something with files */
})
```

```html
<template>
  <button type="button" @click="open">Choose file</button>
</template>
```
