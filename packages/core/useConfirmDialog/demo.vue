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
  // eslint-disable-next-line no-use-before-define
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
