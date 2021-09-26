---
category: Utilities
---

# useConfirmDialog

Basic counter with utility functions.

## Usage

```ts
import { defineComponent, ref } from 'vue'
import { useConfirmDialog } from '@vueuse/core'

export default defineComponent({
  name: 'Demo',
  setup() {
    const show = ref(false)
    const {
      showDialog,
      confirm,
      cancel,
      onConfirm,
      onReject,
    } = useConfirmDialog(show)

    onConfirm(() => {
      console.log('Confirmed!')
    })

    return {
      show,
      content,
      showDialog,
      confirm,
      cancel,
    }
  },
})
```

