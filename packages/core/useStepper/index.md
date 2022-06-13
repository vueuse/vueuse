---
category: Utilities
---

# useStepper

Provides helpers for building a multi-step wizard interface.

## Usage

```js
import { useStepper } from '@vueuse/core'

const { current, previous, next, steps, isFirst, isLast } = useStepper()
```
