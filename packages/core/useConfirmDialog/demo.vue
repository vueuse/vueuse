<script setup lang="ts">
import { ref } from 'vue-demi'
import { useConfirmDialog } from '.'

const content = ref('Confirm or Reject:')
const message = ref('')
const show = ref(false)
const {
  showDialog,
  confirm,
  cancel,
  onConfirm,
  onCancel,
} = useConfirmDialog(show, () => console.log('Modal is shown!'))

onConfirm(() => {
  message.value = 'Confirmed!'
})

onCancel(() => {
  message.value = 'Rejected!'
})

</script>

<template>
  <h2>{{ message }}</h2>
  <button @click="showDialog">
    Click to Show Modal Dialog
  </button>
  <!-- <Teleport to="body"> -->
  <div v-if="show" class="message-box dialog-mask">
    <div class="dialog-content">
      <div class="dialog-body">
        <p>{{ content }}</p>
      </div>
      <footer>
        <button size="mini" @click="confirm">
          OK
        </button>
        <button size="mini" @click="cancel">
          Cancel
        </button>
      </footer>
    </div>
  </div>
  <!-- </Teleport> -->
</template>
