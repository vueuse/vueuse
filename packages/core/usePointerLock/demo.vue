<script setup>
import { ref, watch } from 'vue-demi'
import { useMouse, usePointerLock, useRafFn } from '@vueuse/core'

const { lock, unlock, element } = usePointerLock()
const { x, y } = useMouse({ type: 'movement' })
const totalX = ref(0)
const totalY = ref(0)

watch([x, y], ([x, y]) => {
  if (!element.value)
    return
  totalX.value += x
  totalY.value += y
})

useRafFn(() => {
  // v-bind doesn't work with custom CSS properties for some reason
  document.documentElement.style.setProperty('--x', totalX.value.toString())
  document.documentElement.style.setProperty('--y', totalY.value.toString())
})
</script>

<template>
  <div class="scene">
    <div class="cube" @mousedown="lock" @mouseup="unlock">
      <div class="bases">
        <span style="--i: 1" />
        <span style="--i: -1" />
      </div>
      <div class="sides">
        <span style="--i: 0" />
        <span style="--i: 1" />
        <span style="--i: 2" />
        <span style="--i: 3" />
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --x: 0; /*v-bind('totalX');*/
  --y: 0; /*v-bind('totalY');*/
}

.scene {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  perspective: 300px;
}

.cube {
  cursor: all-scroll;
  position: relative;
  width: 100px;
  height: 100px;
  transform-style: preserve-3d;
  transform: rotateY(calc(var(--x) * .5deg - 45deg)) rotateX(calc(var(--y) * -.5deg));
}

.cube div, .cube span {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.cube div {
  transform-style: preserve-3d;
}

.cube span {
  border: 1px solid;
  backface-visibility: hidden;
  background: rgba(77, 186, 135, .2) center / 75% no-repeat;
}

.cube .bases span {
  transform: rotateX(calc(90deg * var(--i))) translateZ(50px);
}

.cube .sides span {
  transform: rotateY(calc(90deg * var(--i))) translateZ(50px);
}

.cube span:nth-child(odd) {
  background-image: url(/vue.svg);
}

.cube span:nth-child(even) {
  background-image: url(/favicon.svg);
}
</style>
