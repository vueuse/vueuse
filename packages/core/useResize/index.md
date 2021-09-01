---
category: Browser
---

# useResize

Resize an element from all edges.

## Usage

```ts
import { useResize } from '@vueuse/core'

const element = ref(null)
const { width, height, isResizing, direction } = useResize(element)
```
