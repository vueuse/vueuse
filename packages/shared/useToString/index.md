---
category: Utilities
---

# useToString

Reactively convert a ref to string.

## Usage

```ts
import { useToString } from '@vueuse/core'
import { shallowRef } from 'vue'

const number = shallowRef(3.14)
const str = useToString(number)

str.value // '3.14'
```
