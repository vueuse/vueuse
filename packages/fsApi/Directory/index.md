---
category: '@fsApi'
---

# FsFile

A file-system directory handle class that wraps the [FileSystemAccessAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)'s [FileSystemDirectoryHandle](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle) class, allowing you to read, write to, delete, append, and otherwise modify with reactive variables both the directory and any files and directories under it.

## Usage

```ts
import { FsFile, useDirectoryPicker } from '@vueuse/fsApi'

const {
  isSupported,
  open,
} = useDirectoryPicker()

const directory = await open()

assert(directory instanceof FsDirectory === true)

const newDirectory = await directory.createDirectory('new directory')
if (newDirectory.deleteSelf)
  await newDirectory.deleteSelf()
```
