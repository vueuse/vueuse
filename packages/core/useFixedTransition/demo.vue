<script setup lang="ts">
import { useFixedTransition } from '.'

const { transition, value } = useFixedTransition(0)

const fire = () => {
  transition({
    duration: 1000,
    from: 0,
    to: 100,
    transition: [0.75, 0, 0.25, 1],
  })
}
</script>

<template>
  <div>
    <button @click="fire">
      Transition
    </button>

    <p class="mt-2">
      Value: <b>{{ value.toFixed(2) }}</b>
    </p>

    <div class="track number">
      <div class="relative">
        <div class="sled" :style="{ left: value + '%' }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.track {
  background: rgba(125, 125, 125, 0.3);
  border-radius: 0.5rem;
  max-width: 20rem;
  width: 100%;
}

.sled {
  background: var(--c-brand);
  border-radius: 50%;
  height: 1rem;
  position: absolute;
  width: 1rem;
}
.number.track {
  height: 1rem;
  margin: 0.5rem 0;
  padding: 0 0.5rem;
}

.number.track .sled {
  transform: translateX(-50%);
}
</style>
