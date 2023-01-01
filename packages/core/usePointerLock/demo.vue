<script setup>
import { ref, watch } from 'vue-demi'
import { useMouse, usePointerLock } from '@vueuse/core'

const { lock, unlock, element } = usePointerLock()
const { x, y } = useMouse({ type: 'movement' })
const rotY = ref(-45)
const rotX = ref(0)

watch([x, y], ([x, y]) => {
  if (!element.value)
    return
  rotY.value += x / 2
  rotX.value -= y / 2
})
</script>

<template>
  <div class="scene">
    <div id="demo-cube" class="cube" @mousedown.capture="lock" @mouseup="unlock">
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
#demo-cube {
  --rotY: v-bind(rotY);
  --rotX: v-bind(rotX);
  transform: rotateY(calc(var(--rotY) * 1deg)) rotateX(calc(var(--rotX) * 1deg));
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
