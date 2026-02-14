---
category: Utilities
---

# useCounter

Basic counter with utility functions.

## Basic Usage

```ts
import { useCounter } from '@vueuse/core'

const { count, inc, dec, set, reset } = useCounter()
```

## Usage with options

```ts
import { useCounter } from '@vueuse/core'

const { count, inc, dec, set, reset } = useCounter(1, { min: 0, max: 16 })
```
