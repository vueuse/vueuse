<script setup lang="ts">
import { useFileDialog } from '.'

const { files, open } = useFileDialog()
</script>

<template>
  <p>You have selected: {{ files ? files.length : 0 }} files</p>
  <button type="button" @click="open">
    Choose file
  </button>
</template>
