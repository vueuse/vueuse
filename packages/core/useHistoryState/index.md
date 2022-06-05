---
category: State
---

# useHistoryState

Bind state to [History.state](https://developer.mozilla.org/en-US/docs/Web/API/History/state). It will be persisted and restored upon navigating.

## Usage

```ts
import { useHistoryState } from '@vueuse/core'

const persistentCounter = useHistoryState('persistentCounter', 0)
```
