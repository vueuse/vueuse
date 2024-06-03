---
category: Utilities
---

# useSliceUpload

A hook to slice a file into blob array.

## Usage

```ts
import { useFileDialog, useSliceUpload } from '@vueuse/core'

const { onChange } = useFileDialog()

async function uploadFunction(slice: Blob) {
  /** upload slice to server */
}

onChange((files) => {
  const { fileSlices, upload } = useSliceUpload(files[0], {
    sliceSize: 1024 * 1024, // Default 1MB
    uploadFunction,
  })

  upload()
})
```
