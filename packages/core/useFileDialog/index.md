---
category: Browser
---

# useFileDialog

Open file dialog with ease.

## Usage

```ts
import { useFileDialog } from '@vueuse/core'

const { files, open, reset, onChange } = useFileDialog({
  accept: 'image/*', // Set to accept only image files
})

onChange((files) => {
  /** do something with files */
})
```

```html
<template>
  <button type="button" @click="open">Choose file</button>
</template>
```
