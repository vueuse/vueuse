<script setup lang="ts">
import { ref } from 'vue'
import { useUpdater } from './index'

const isUpdate = ref(0)
const [handleNoUpdate, handleUpdate] = useUpdater(7000, '/mnxd/main')
handleNoUpdate(() => {
  // TO-DO: not up-to-date
})
handleUpdate(() => {
  // TO-DO:updated
  if (isUpdate.value !== 1)
    alert('The system has been updated, please force the browser!')

  isUpdate.value = 1
})
</script>

<template>
  <div />
</template>

<style scoped>

</style>
