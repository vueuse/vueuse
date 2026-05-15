<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const textarea = useTemplateRef('textarea')
const { input } = useTextareaAutosize({ element: textarea })
</script>

<template>
  <div>
    <span>Type, the textarea will grow:</span>
    <textarea
      ref="textarea"
      v-model="input"
      class="resize-none"
      placeholder="What's on your mind?"
    />
  </div>
</template>

<style scoped>
textarea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

textarea::-webkit-scrollbar {
  display: none;
}
</style>
