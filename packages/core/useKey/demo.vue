<script setup lang="ts">
import { ref } from 'vue-demi'
import { useKey } from '.'

const translateX = ref(0)
const translateY = ref(0)

useKey('ArrowUp', (e: KeyboardEvent) => {
  translateY.value -= 10
  e.preventDefault()
})

useKey('ArrowDown', (e: KeyboardEvent) => {
  translateY.value += 10
  e.preventDefault()
})

useKey('ArrowLeft', (e: KeyboardEvent) => {
  translateX.value -= 10
  e.preventDefault()
})

useKey('ArrowRight', (e: KeyboardEvent) => {
  translateX.value += 10
  e.preventDefault()
})
</script>

<template>
  <div>
    <div class="container">
      <div class="ball" :style="{transform: `translate(${translateX}px, ${translateY}px)`}" />
    </div>
    <div class="text-center mt-4">
      Use the arrow keys to control the movement of the ball.
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 100px;
  margin: auto;
  overflow: hidden;
  border: 1px solid #333;
}

.ball {
  width: 16px;
  height: 16px;
  background: #333;
  border-radius: 50%;
}

</style>
