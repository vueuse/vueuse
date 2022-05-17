---
category: Utilities
---

# useRandomColor

Reactive Random Color. Supports RGB, RGBA, HEX.

## Basic Usage

```ts
import { Ref, ref } from 'vue'
import { useRandomColor } from '@vueuse/core'

const { color, changeColor } = useRandomColor()
```

## Configuration

For example:
```ts
const { color, changeColor } = useRandomColor({
  type: 'RGB',
})
```
