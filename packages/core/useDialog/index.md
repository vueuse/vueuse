---
category: Utilities
related:
  - makeDialogComposable
  - useConfirmDialog
---

# useDialog

Creates a general-purpose, fully typed dialog. It's generally better to create a composable using `makeDialogComposable`  and use that instead.

## Functions and hooks

- `reveal()` - opens the dialog with the given properties, triggers the `on.reveal` hook
- `close()` - closes the dialog with optional result data, triggers the `on.close` hook

## Example

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useDialog } from '@vueuse/core'

type DialogResult = 'confirmed' | 'cancelled'

const { isRevealed, reveal, close } = useDialog<DialogResult>()
const status = ref<DialogResult>()

async function show() {
  const { result } = await reveal()
  status.value = result
}
</script>

<template>
  <span v-text="status" />

  <button
    :disabled="isRevealed"
    @click="show"
  >
    Click to Show Modal Dialog
  </button>

  <div v-if="isRevealed">
    <h2>Confirmation</h2>
    <div>
      <button @click="close('confirmed')">
        OK
      </button>
      <button @click="close('cancelled')">
        Cancel
      </button>
    </div>
  </div>
</template>
```
