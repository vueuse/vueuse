<script setup lang="ts">
import { ref } from 'vue-demi'
import { useContextMenu } from '.'
const el = ref<HTMLElement>(null)
useContextMenu(el,
  [
    {
      text: 'Red',
      handler() {
        el.value.style.backgroundColor = 'red'
      },
    },
    {
      text: 'Green',
      handler() {
        el.value.style.backgroundColor = 'green'
      },
    },
  ],
)
</script>

<template>
  <div ref="el" class="h-10 d-flex justify-content-center align-items-center border border-dark container">
    <p>Right click me</p>
  </div>
</template>

<style scoped>
.container{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ccc;
    height: 100;
    overflow: hidden;
}
</style>
