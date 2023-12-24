---
category: '@fsApi'
---

# FsFile

A file-system handle class that wraps the [FileSystemAccessAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)'s [FileSystemFileHandle](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle) class, allowing you to read, write to, delete, append, and otherwise modify with reactive variables.

## Usage

```ts
import { FsFile, useOpenFilePicker } from '@vueuse/fsApi'

const {
  isSupported,
  open,
} = useOpenFilePicker()

const fileHandle = await open()

assert(fileHandle instanceof FsFile === true)

await fileHandle.append('some new text')
```

```ts
import { FsFile, useDirectoryPicker } from '@vueuse/fsApi'

const {
  isSupported,
  open,
} = useDirectoryPicker()

const directory = await open()
const allFsHandles = await directory.allValues()

assert(allFsHandles?.[0] instanceof FsFile === true)

allFsHandles?.[0].delete()
```
