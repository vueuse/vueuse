---
category: '@fsApi'
---

# useDirectoryPicker

Open a handle for a selected Directory using the [FileSystemAccessAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)'s [showDirectoryPicker](https://developer.mozilla.org/en-US/docs/Web/API/window/showDirectoryPicker) function, getting a persistent file-handle in return, from which you can create and write files and directories freely under that handle without additional prompts.

## Usage

```ts
import { useDirectoryPicker } from '@vueuse/fsApi'

const {
  isSupported,
  open,
} = useDirectoryPicker()
```
