---
category: Utilities
---

# useBase64

Reactive base64 transforming. Supports plain text, buffer, files, canvas, objects, maps, sets and images.

## Usage

```ts
import { Ref, ref } from 'vue'
import { useBase64 } from '@vueuse/core'

const text = ref('')

const { base64 } = useBase64(text)
```

If you use object, array, map or set you can provide serializer in options. Otherwise, your data will be serialized by default serializer.
Objects and arrays will be transformed in string by JSON.stringify. Map and set will be transformed in object and array respectively before stringify.
