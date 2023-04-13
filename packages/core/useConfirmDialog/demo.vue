<script setup lang="ts">
import { ref } from 'vue'
import { useConfirmDialog } from '@vueuse/core'

const message = ref('')
const revaled1 = ref(false)
const revaled2 = ref(false)

const dialog1 = useConfirmDialog(revaled1)
const dialog2 = useConfirmDialog(revaled2)

dialog1.onReveal(() => {
  message.value = 'Modal is shown!'
})

dialog1.onConfirm(() => {
  dialog2.reveal()
})

dialog1.onCancel(() => {
  message.value = 'Canceled!'
})

dialog2.onReveal(() => {
  message.value = 'Second modal is shown!'
})

dialog2.onConfirm((result) => {
  if (result)
    message.value = 'Confirmed!'
  else message.value = 'Rejected!'
})

dialog2.onCancel(() => {
  dialog1.reveal()
  message.value = 'Canceled!'
})
</script>

<template>
  <h2>
    <span class="text-orange-400">{{ message }}</span>
  </h2>
  <button
    :disabled="revaled1 || revaled2"
    @click="dialog1.reveal"
  >
    Click to Show Modal Dialog
  </button>

  <!-- First Dialog -->
  <div v-if="revaled1">
    <div>
      <div>
        <p>Show Second Dialog?</p>
      </div>
      <footer>
        <button @click="dialog1.confirm">
          OK
        </button>
        <button @click="dialog1.cancel">
          Cancel
        </button>
      </footer>
    </div>
  </div>

  <!-- Second Dialog -->
  <div v-if="revaled2">
    <div>
      <div>
        <p>Confirm or Reject</p>
      </div>
      <footer>
        <button @click="dialog2.confirm(true)">
          Confirm
        </button>
        <button @click="dialog2.confirm(false)">
          Reject
        </button>
        <button @click="dialog2.cancel">
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 420px;
  max-width: 100%;
  z-index: 10;
}
.modal-layout{
  z-index: 20;
  left: 0;
  top: 0;
  position: fixed;
  background-color: #7c7c7c7a;
  width: 100%;
  height: 100%;
}
.inner {
  background-color: var(--vp-c-bg);
  padding: 0.4em 2em;
  border-radius: 5px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 2px 2px 10px rgba(10, 10, 10, 0.1);
}
.small {
  position: absolute;
  top: -0.9rem;
  right: -0.5rem;
  font-weight: bold;
}
.button:focus {
  outline: rgb(91, 91, 255) solid 3px;
}
.heading {
  font-weight: bold;
  font-size: 1.4rem;
  margin-bottom: 2rem;
}
</style>
