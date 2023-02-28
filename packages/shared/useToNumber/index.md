---
category: Utilities
---

# useToNumber

Reactively convert a string ref to number.

## Usage

```ts
import { useToNumber } from '@vueuse/core'

const str = ref('123')
const number = useToNumber(str)

number.value // 123
```
