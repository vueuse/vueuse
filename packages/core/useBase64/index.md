---
category: Utilities
---

# useBase64

Reactive base64 transforming. Supports plain text, buffer, files, canvas and images.

## Usage

```ts
import { ref, Ref } from 'vue'
import { useBase64 } from '@vueuse/core'

const text = ref('')

const { base64 } = useBase64(text)
```
