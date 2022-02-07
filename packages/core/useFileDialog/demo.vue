<script setup lang="ts">
import { useFileDialog } from '.'

const { files, openFileDialog } = useFileDialog()
</script>

<template>
  <p>You have selected: {{ files ? files.length : 0 }} files</p>
  <button type="button" @click="openFileDialog">
    Choose file
  </button>
</template>
