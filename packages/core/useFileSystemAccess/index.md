---
category: Browser
---

# useFileSystemAccess

create and read and write local files[FileSystemAccessAPI](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)

## Usage

```ts
import { useFileSystemAccess } from '@vueuse/core'

const { isSupported, data, file, fileName, fileMIME, fileSize, fileLastModified, create, open, save, saveAs, updateData } = useFileSystemAccess()
```
