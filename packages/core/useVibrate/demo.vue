<script setup lang="ts">
import { ref } from 'vue-demi'
import { useVibrate } from '.'

const vibrating = ref(false)

const { isSupported } = useVibrate(vibrating, {
  pattern: [300, 100, 200, 100, 1000, 300],
  loop: true,
})

function toggleVibrating() {
  vibrating.value = !vibrating.value
}

</script>

<template>
  <div v-if="isSupported">
    <div>{{ `Vibrating : ${vibrating}` }}</div>
    <button @click="toggleVibrating">
      {{ vibrating ? "Stop" : "Vibrate" }}
    </button>
  </div>
  <div v-else>
    Your browser does not support Vibration API
  </div>
</template>
