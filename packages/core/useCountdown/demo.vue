<script setup lang="ts">
import { useCountdown, useEventListener } from '@vueuse/core'
import { shallowRef, useTemplateRef } from 'vue'

const countdownSeconds = shallowRef(5)
const rocketRef = useTemplateRef('rocketRef')
const { remaining, start, stop, pause, resume } = useCountdown(countdownSeconds, {
  onComplete() {
    rocketRef.value!.classList.add('launching')
  },
  onTick() {

  },
})

function startCountdown() {
  rocketRef.value!.classList.remove('launching')
  start(countdownSeconds)
}

useEventListener(rocketRef, 'animationend', () => {
  rocketRef.value!.classList.remove('launching')
})
</script>

<template>
  <div class="flex flex-col items-center">
    <div ref="rocketRef" class="rocket">
      🚀
    </div>
    Rocket launch in {{ remaining }} seconds

    <div class="flex items-center gap-2 mt-4">
      Countdown: <input v-model="countdownSeconds" type="number">
    </div>
    <div class="flex items-center gap-2 justify-center">
      <button @click="startCountdown">
        Start
      </button>
      <button @click="stop">
        Stop
      </button>
      <button @click="pause">
        Pause
      </button>
      <button @click="resume">
        Resume
      </button>
    </div>
  </div>
</template>

<style scoped>
input {
  width: 40px;
}

:root {
  --rocket-rotate: rotate(-45deg);
}
@keyframes rocket {
  0% {
    transform: translateY(0) var(--rocket-rotate);
  }
  50% {
    transform: translateY(-200px) var(--rocket-rotate);
  }
  100% {
    transform: translateY(0) var(--rocket-rotate);
  }
}

.rocket {
  transform: var(--rocket-rotate);
}

.rocket.launching {
  animation-fill-mode: forwards;
  animation-play-state: running;
  animation-duration: 4s;
  animation-timing-function: ease-in-out;
  animation-name: rocket;
}
</style>
