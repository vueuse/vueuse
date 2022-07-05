<script setup lang="ts">
import { useTextarea } from '@vueuse/core'

const { textarea, input } = useTextarea()
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
