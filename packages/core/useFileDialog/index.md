---
category: Browser
---

# useFileDialog

Open file dialog with ease.

## Usage

```ts
import { useFileDialog } from '@vueuse/core'

const { files, openFileDialog } = useDialog()
```

```html
<template>
  <button type="button" @click="openFileDialog">Choose file</button>
</template>
```
