---
category: '@fsApi'
---

# useOpenFilePicker

Open files using the [FileSystemAccessAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)'s [showOpenFilePicker](https://developer.mozilla.org/en-US/docs/Web/API/window/showOpenFilePicker) function, getting a persistent file handle in return, from which you can make writes and updates to the file without making another request.

## Usage

```ts
import { useOpenFilePicker } from '@vueuse/fsApi'

const {
  isSupported,
  open,
} = useOpenFilePicker()
```
