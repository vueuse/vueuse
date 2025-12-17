<script setup lang="ts">
import { useDisplayMedia } from '@vueuse/core'
import { useTemplateRef, watchEffect } from 'vue'

const video = useTemplateRef('video')
const { stream, enabled } = useDisplayMedia()

watchEffect(() => {
  if (video.value)
    video.value.srcObject = stream.value!
})
</script>

<template>
  <div class="flex flex-col gap-4 text-center">
    <div>
      <button @click="enabled = !enabled">
        {{ enabled ? 'Stop' : 'Start' }} sharing my screen
      </button>
    </div>

    <div>
      <video
        ref="video"
        muted
        autoplay
        controls
        class="h-100 w-auto"
      />
    </div>
  </div>
</template>
