
<script setup lang="ts">
import { ref } from 'vue'
import { useTouchMove } from '@vueuse/core'
const ele =ref<HTMLElement>()

const {disX,disY,directionX,directionY} = useTouchMove(ele)


</script>

<template>
  <div id="large-container" ref="ele" class="w-40 h-96">
   Touching the screen
    <br>
    transverse:{{directionX}}
    <br>
    Sliding distance: {{disX}}px
    <br>
    <br>
    portrait:{{directionY}}
    <br>
    Sliding distance:{{disY}}px

  </div>
</template>


