---
category: Browser
---

# useSaveFilePicker

Create and write local files using the [FileSystemAccessAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)'s [showSaveFilePicker](https://developer.mozilla.org/en-US/docs/Web/API/window/showSaveFilePicker) function.

## Usage

```ts
import { useSaveFilePicker } from '@vueuse/fsApi'

const {
  isSupported,
  // `open` method is just available for consistency,
  // can create or saveAs depending on parameters
  open,
  create,
  saveAs,
} = useSaveFilePicker()
```
