---
category: Reactivity
---

# refResetWhen

A ref which will be reset when an EventHook triggered.

## Usage

```ts
import { refResetOn, useConfirmDialog } from '@vueuse/core'

const dialog = useConfirmDialog()
const data = refResetOn(() => ({ a: 1 }), dialog.onCancel)
```
