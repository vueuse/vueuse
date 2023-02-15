<script setup lang="ts">
import { onMounted, ref } from 'vue'
import animJson from './anim.json'
import { useLottiePlayer } from '.'
const anim = ref()
onMounted(() => {
  const lottieAnim = useLottiePlayer(
    {
      container: anim.value,
      loop: true,
      autoplay: true,
      animationData: animJson,
    },
  )

  lottieAnim.value.setSpeed(2)
})
</script>

<template>
  <note>
    Text content for useLottiePlayer
  </note>
  <div ref="anim" class="lottie-node" style="height:100px;" />
</template>
