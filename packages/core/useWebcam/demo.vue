<script setup lang="ts">
import { onMounted, ref } from 'vue-demi'
import { useWebcam } from '.'

const videoRef = ref<HTMLVideoElement | null>(null)
const { getUserMedia, settings } = useWebcam(videoRef)
onMounted(async() => {
  await getUserMedia()
  console.log(settings)
})
</script>

<template>
  <video ref="videoRef" autoplay />
</template>
