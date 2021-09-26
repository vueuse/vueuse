<script lang="ts">
import { defineComponent, ref } from '@vue-demi'
import { useConfirmDialog } from '.'

export default defineComponent({
  name: 'Demo',
  setup() {
    const content = ref('')
    const show = ref(false)
    const {
      showDialog,
      confirm,
      cancel,
      onConfirm,
      onReject,
    } = useConfirmDialog(show, () => console.log('Modal is shown!'))

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
</script>

<template>
  <h1>My App</h1>
  <input v-model="content" type="text" />
  <button @click="showDialog">
    Show Content
  </button>
  <Teleport to="body">
    <div v-if="show" class="message-box dialog-mask" @click="cancel">
      <div class="dialog-content">
        <div class="dialog-body">
          <p>{{ content }}</p>
        </div>
        <footer>
          <button size="mini" @click="confirm">
            OK
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>
