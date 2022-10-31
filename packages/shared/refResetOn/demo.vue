<script setup lang="ts">
import { refResetOn, toReactive, useConfirmDialog } from '@vueuse/core'

const dialog = useConfirmDialog()
const data = toReactive(refResetOn(() => ({ a: 'hello world!' }), dialog.onCancel))
</script>

<template>
  <div>
    <div>current data: {{ data }}</div>
    <button @click="dialog.reveal">
      Open Modal
    </button>
    <div v-if="dialog.isRevealed.value">
      <p>Modal showed!</p>
      <div>input here: <input v-model="data.a" class="input"></div>
      <div>
        <button @click="dialog.cancel">
          cancel
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.input {
  padding: 4px;
  border: 1px solid gray;
}
</style>
