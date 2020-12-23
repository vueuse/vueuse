<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useNProgress } from '.'

return useNProgress()
</script>

<template>
  <div>
    <note>Click to change progress status</note>
    <div class="flex items-center">
      <button @click="isLoading = !isLoading">
        {{ !isLoading ? 'Start' : 'Stop' }}
      </button>
    </div>
  </div>
</template>
