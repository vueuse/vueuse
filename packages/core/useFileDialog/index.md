---
category: Browser
---

# useFileDialog

Open file dialog with ease.

## Usage

```vue
<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'

const { files, open, reset, onCancel, onChange } = useFileDialog({
  accept: 'image/*', // Set to accept only image files
  directory: true, // Select directories instead of files if set true
})

onChange((files) => {
  /** do something with files */
})

onCancel(() => {
  /** do something on cancel */
})
</script>

<template>
  <button type="button" @click="open">
    Choose file
  </button>
</template>
```

## Initial Values

Before files are selected, `files` is `null`. Set your own initial value with `initials`:

```ts
import { useFileDialog } from '@vueuse/core'

declare const previousFiles: FileList
// ---cut---
const { files } = useFileDialog({ initials: { files: previousFiles } })
```

The returned `files` is readonly. To own the state, pass your own ref to `initials`, `useFileDialog` writes into it.
