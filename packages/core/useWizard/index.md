---
category: Utilities
---

# useWizard

Provides helpers for building a multi-step wizard interface.

## Usage

```js
import { useWizard } from '@vueuse/core'

const { current, previous, next, steps, isFirst, isLast } = useWizard()
```
