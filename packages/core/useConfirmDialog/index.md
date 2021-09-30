---
category: Utilities
---

# useConfirmDialog

Creates event hooks to support modals and confirmation dialog chains.

## Usage

### **Basic Usage**

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

### Two way of using this function

There are actually two ways to use this feature. The first method uses hooks, this method was shown in the previous example, and the second uses the promise returned by the reveal function. If you prefer working with promises, you can use the second way.
It is advisable not to mix them. Use either hooks or promises.

Using promise:

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
    } = useConfirmDialog(show)

    openDialog( async() => {
      const { data, isCanceled } = await reveal()
      if(!isCanceled.value){
        console.log(data)
      }
    })

    return {
      show,
      openDialog,
      confirm,
      cancel,
    }
  },
})
```
