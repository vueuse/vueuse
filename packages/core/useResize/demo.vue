<script setup lang="ts">
import { ref } from 'vue-demi'
import { useResize } from '.'
const element = ref(null)
const { width, height, isResizing, direction } = useResize(element)
</script>

<template>
  <div ref="element" class="bg-gray-700 box" :class="[direction]">
    <p>{{ width }} x {{ height }}</p>
    <p>isResizing: {{ isResizing }}</p>
    <p>Direction: {{ direction }}</p>
  </div>
</template>

<style scoped>
.box {
  transition: box-shadow 150ms ease-in-out;
  background: var(--code-inline-bg-color);
  @apply relative p-5 rounded;
}
.top-left {
  box-shadow: rgb(0 114 255) 0px -2px 0px 0px,rgb(0 114 255) -2px 0px 0px 0px;
}
.top-right {
  box-shadow: rgb(0 114 255) 0px -2px 0px 0px, rgb(0 114 255) 2px 0px 0px 0px;
}
.bottom-left {
  box-shadow: rgb(0 114 255) 0px 2px 0px 0px, rgb(0 114 255) -2px 0px 0px 0px;
}
.bottom-right {
  box-shadow: rgb(0 114 255) 0px 2px 0px 0px, rgb(0 114 255) 2px 0px 0px 0px;
}
.bottom {
  box-shadow: rgb(0 114 255) 0px 2px 0px 0px;
}
.top {
  box-shadow: rgb(0 114 255) 0px -2px 0px 0px;
}
.left {
  box-shadow: rgb(0 114 255) -2px 0px 0px 0px;
}
.right {
  box-shadow: rgb(0 114 255) 2px 0px 0px 0px;
}

</style>
