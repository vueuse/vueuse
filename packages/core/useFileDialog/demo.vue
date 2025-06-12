<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'

const { files, open, reset, onCancel, onChange } = useFileDialog()
onChange((files) => {
  /** do something with files */
})

onCancel(() => {
  /** do something on cancel */
})
</script>

<template>
  <button type="button" @click="open()">
    Choose files
  </button>
  <button type="button" :disabled="!files" @click="reset()">
    Reset
  </button>
  <template v-if="files">
    <p>You have selected: <b>{{ `${files.length} ${files.length === 1 ? 'file' : 'files'}` }}</b></p>
    <li v-for="file of files" :key="file.name">
      {{ file.name }}
    </li>
  </template>
</template>
