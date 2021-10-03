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

// Second Dialog
const {
  reveal: reveal2,
  confirm: confirm2,
  cancel: cancel2,
  onConfirm: onConfirm2,
  onCancel: onCancel2,
  onReveal: onReveal2,
} = useConfirmDialog(show2)

onReveal(() => {
  message.value = 'Modal is shown!'
})

onConfirm(() => {
  reveal2()
})

onCancel(() => {
  message.value = 'Canceled!'
})

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
  <div v-if="show" class="modal-layout" @click.self="cancel">
    <div class="modal">
      <div class="inner">
        <p class="heading">
          Show Second Dialog?
        </p>
        <footer>
          <button class="button" @click="confirm">
            OK
          </button>
          <button class="button" @click="cancel">
            Cancel
          </button>
        </footer>
      </div>
      <button class="button small" title="Close" @click="cancel">
        𝖷
      </button>
    </div>
  </div>
  <!-- Second Dialog -->
  <div v-show="show2" class="modal-layout" @click.self="confirm2(false)">
    <div class="modal">
      <div class="inner">
        <p class="heading">
          Confirm or Reject
        </p>
        <footer>
          <button class="button" @click="confirm2(true)">
            Confirm
          </button>
          <button class="button" @click="confirm2(false)">
            Reject
          </button>
          <button class="button" @click="cancel2">
            Cancel
          </button>
        </footer>
      </div>
      <button class="button small" title="Close" @click="cancel2">
        𝖷
      </button>
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
  background-color: var(--c-bg);
  padding: 0.4em 2em;
  border-radius: 5px;
  border: 1px solid var(--c-divider-light);
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
