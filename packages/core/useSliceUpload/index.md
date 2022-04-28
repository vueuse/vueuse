---
category: Misc
---

# useSliceUpload

The big file slice upload function.

## Usage

```js
import { useSliceUpload } from '@vueuse/core'

const { uploadFile } = useSliceUpload(file, {
  chunkSize: 2 * 1024 * 1024,
  initFileUpload: () => {
    // init upload
  },
  uploadPartFile: (chunk: Blob, index: number) => {
    // upload the file chunks
  }
  finishFileUpload: (md5: string) => {
    // When the file slice is all uploaded, send a request to merge the file.
  }
})

uploadFile()
```
