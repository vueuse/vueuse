---
category: Browser
---

# useFileSystemAccess

Creating, Reading and Writing local files.

## Usage

```ts
import { useFileSystemAccess } from '@vueuse/core'

const { isSupported, data, create, save, open } = useFileSystemAccess()
```
