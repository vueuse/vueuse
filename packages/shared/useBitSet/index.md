---
category: Utilities
---

# useBitSet

Give us a higher performance way to record numbers (enumerations). Note that the range of values used is [-2^31,2^31-1]

## Tip

Get strength from magic-string 🔥

* https://github.com/Rich-Harris/magic-string/blob/master/src/BitSet.js


## Usage

```ts
import { useBitSet } from '@vueuse/core'

const localBitSet = useBitSet()
localBitSet.add(8)
localBitSet.add(15)
console.log(localBitSet.has(8) === true) // true
console.log(localBitSet.has(22) === false) // false
console.log(localBitSet.has(15) === true) // true
localBitSet.reset()
console.log(localBitSet.isEmpty()) // true
```
