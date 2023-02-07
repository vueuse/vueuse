---
category: Utilities
---

# useConfirmDialog

Creates event hooks to support modals and confirmation dialog chains.

Functions can be used on the template, and hooks are a handy skeleton for the business logic of modals dialog or other actions that require user confirmation.

## Functions and hooks

- `reveal()` - triggers `onReveal` hook and sets `revealed.value` to `true`. Returns promise that resolves by `confirm()` or `cancel()`.
- `confirm()` - sets `isRevealed.value` to `false` and triggers `onConfirm` hook.
- `cancel()` - sets `isRevealed.value` to `false` and triggers `onCancel` hook.

## Basic Usage

### Using hooks

```html
<script setup>
import { useConfirmDialog } from '@vueuse/core'

const {
  isRevealed,
  reveal,
  confirm,
  cancel,
  onReveal,
  onConfirm,
  onCancel,
} = useConfirmDialog()
</script>

<template>
  <button @click="reveal">Reveal Modal</button>

  <teleport to="body">
    <div v-if="isRevealed" class="modal-bg">
      <div class="modal">
        <h2>Confirm?</h2>
        <button @click="confirm">Yes</button>
        <button @click="cancel">Cancel</button>
      </div>
    </div>
  </teleport>
</template>
```

### Promise

If you prefer working with promises:

```html
<script setup>
import { useConfirmDialog } from '@vueuse/core'

const {
  isRevealed,
  reveal,
  confirm,
  cancel,
} = useConfirmDialog()

const openDialog = async () => {
  const { data, isCanceled } = await reveal()
  if (!isCanceled) {
    console.log(data)
  }
}
</script>

<template>
  <button @click="openDialog">Show Modal</button>

  <teleport to="body">
    <div v-if="isRevealed" class="modal-layout">
      <div class="modal">
        <h2>Confirm?</h2>
        <button @click="confirm(true)">Yes</button>
        <button @click="confirm(false)">No</button>
      </div>
    </div>
  </teleport>
</template>
```
