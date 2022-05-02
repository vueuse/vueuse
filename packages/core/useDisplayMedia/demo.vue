<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useDisplayMedia } from '@vueuse/core'

const video = ref<HTMLVideoElement>()
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
