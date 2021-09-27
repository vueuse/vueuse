<script setup lang="ts">
import { ref } from 'vue-demi'
import { useConfirmDialog } from '.'

const message = ref('')
const show = ref(false)
const show2 = ref(false)

// First Dialog
const {
  showDialog,
  confirm,
  cancel,
  onConfirm,
  onCancel,
} = useConfirmDialog(show, () => message.value = 'Modal is shown')

onConfirm(() => {
  // eslint-disable-next-line no-use-before-define
  showDialog2()
})

onCancel(() => {
  message.value = 'Canceled!'
})

// Second Dialog
const {
  showDialog: showDialog2,
  confirm: confirm2,
  cancel: cancel2,
  onConfirm: onConfirm2,
  onCancel: onCancel2,
} = useConfirmDialog(show2, () => message.value = 'Second modal is shown!')

onConfirm2((result) => {
  if (result) message.value = 'Confirmed!'
  else message.value = 'Rejected!'
})
onCancel2(() => {
  showDialog()
  message.value = 'Canceled!'
})

</script>

<template>
  <h2>
    Info: <span :style="{ color: 'red' }">{{ message }}</span>
  </h2>
  <button :disabled="show || show2" @click="showDialog">
    Click to Show Modal Dialog
  </button>
  <!-- First Dialog -->
  <div v-if="show" class="message-box dialog-mask">
    <div class="dialog-content">
      <div class="dialog-body">
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
  <div v-if="show2" class="message-box dialog-mask">
    <div class="dialog-content">
      <div class="dialog-body">
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
