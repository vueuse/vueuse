<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'

const { textarea, input } = useTextareaAutosize()
</script>

<template>
  <div>
    <span>Type, the textarea will grow:</span>
    <textarea
      ref="textarea"
      v-model="input"
      class="resize-none responsive-textarea"
      placeholder="What's on your mind?"
    />
  </div>
</template>

<style scoped>
.responsive-textarea {
  min-width: auto;
}
</style>
