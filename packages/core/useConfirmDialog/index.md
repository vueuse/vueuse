---
category: Utilities
---

# useConfirmDialog

Creates event hooks to support modals and confirmation dialog chains.

Functions can be used on the template, and hooks are a handy skeleton for the business logic of modals dialog or other actions that require user confirmation.

## Functions and hooks

- `reveal()` - triggers `onReveal` hook and sets `show.value` to `true`. Returns promise that resolves by `confirm()` or `cancel()`.
- `confirm()` - sets `show.value` to `false` and triggers `onConfirm` hook.
- `cancel()` - sets `show.value` to `false` and triggers `onCancel` hook.

## Basic Usage

### Using hooks

Script:

```ts
import { defineComponent, ref } from 'vue'
import { useConfirmDialog } from '@vueuse/core'

export default defineComponent({
  setup() {
    const show = ref(false)
    const {
      reveal,
      confirm,
      cancel,
      onReveal,
      onConfirm,
      onCancel,
    } = useConfirmDialog(show)

    onConfirm(() => {
      console.log('Confirmed!')
    })

    return {
      show,
      reveal,
      confirm,
      cancel,
    }
  },
})
```

Template:

```html
<template>
  <button @click="reveal">Show Modal</button>

  <teleport to="body">
    <div v-if="show" class="modal-bg">
      <div class="modal">
        <h2>Confirm?</h2>
        <button @click="confirm">Yes</button>
        <button @click="cancel">Cancel</button>
      </div>
    </div>
  </teleport>
</template>
```

### Another way of using this function. Promise

There are actually two ways to use this feature. The first method uses hooks, this method was shown in the previous example, and the second uses the promise returned by the reveal function. If you prefer working with promises, you can use the second way.
It is advisable not to mix them. Use either hooks or promises.

Using promise:

```ts
import { defineComponent, ref } from 'vue'
import { useConfirmDialog, onClickOutside } from '@vueuse/core'

export default defineComponent({
  setup() {
    const show = ref(false)
    const {
      reveal,
      confirm,
      cancel,
    } = useConfirmDialog(show)

    openDialog( async() => {
      const { data, isCanceled } = await reveal()
      if(!isCanceled.value){
        console.log(data)
      }
    })
    // on click outside logic
    const target = ref(null)
    onClickOutside(target, () => cancel())

    return {
      show,
      openDialog,
      confirm,
      target,
    }
  },
})
```

Template:

```html
<template>
  <button @click="openDialog">Show Modal</button>

  <teleport to="body">
    <div v-if="show" class="modal-layout">
      <div ref="target" class="modal">
        <h2>Confirm?</h2>
        <button @click="confirm(true)">Yes</button>
        <button @click="confirm(false)">No</button>
      </div>
    </div>
  </teleport>
</template>
```

## Advanced Usage

### Building dialog chains using hooks

Code from the demo on this page. Script:

```ts
<script setup lang="ts">
import { ref } from 'vue-demi'
import { useConfirmDialog } from '.'

const message = ref('')
const show = ref(false)
const show2 = ref(false)

// First Dialog
const {
  reveal,
  confirm,
  cancel,
  onConfirm,
  onCancel,
  onReveal,
} = useConfirmDialog(show)

onReveal(() => {
  message.value = 'Modal is shown!'
})

onConfirm(() => {
  reveal2()
})

onCancel(() => {
  message.value = 'Canceled!'
})

// Second Dialog
const {
  reveal: reveal2,
  confirm: confirm2,
  cancel: cancel2,
  onConfirm: onConfirm2,
  onCancel: onCancel2,
  onReveal: onReveal2,
} = useConfirmDialog(show2)

onReveal2(() => {
  message.value = 'Second modal is shown!'
})

onConfirm2((result) => {
  if (result) message.value = 'Confirmed!'
  else message.value = 'Rejected!'
})
onCancel2(() => {
  reveal()
  message.value = 'Canceled!'
})

</script>
```

Template:

```html
<template>
  <h2>
    Info: <span :style="{ color: 'red' }">{{ message }}</span>
  </h2>
  <button :disabled="show || show2" @click="reveal">
    Click to Show Modal Dialog
  </button>
  <!-- First Dialog -->
  <div v-if="show">
    <div>
      <div>
        <p>Show Second Dialog?</p>
      </div>
      <footer>
        <button @click="confirm">
          OK
        </button>
        <button @click="cancel">
          Cancel
        </button>
      </footer>
    </div>
  </div>
  <!-- Second Dialog -->
  <div v-if="show2">
    <div>
      <div>
        <p>Confirm or Reject</p>
      </div>
      <footer>
        <button @click="confirm2(true)">
          Confirm
        </button>
        <button @click="confirm2(false)">
          Reject
        </button>
        <button @click="cancel2">
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>
```
