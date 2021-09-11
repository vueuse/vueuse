<script setup lang="ts">
import { ref, toRefs } from 'vue-demi'
import { useScroll } from '.'
const scrollRef = ref<HTMLElement | null>(null)
const { x, y, scrolling, finished, arrivedStatus } = useScroll(scrollRef)
const { left, right, top, bottom } = toRefs(arrivedStatus)
</script>

<template>
  <header class="w-520px p-5px mb-20 border border-red-400">
    <div clss="mb-10">
      <span class="inline-block w-125px">Position:</span>
      <span class="pr-2">X : <b class="text-blue-500">{{ x }}</b></span>
      <span class="pr-2">Y : <b class="text-blue-500">{{ y }}</b></span>
    </div>
    <div clss="mb-10">
      <span class="inline-block w-125px">ScrollingStatus:</span>
      <span class="pr-2 text-blue-500"><b class="text-blue-500">{{ scrolling }}</b></span>
    </div>
    <div clss="mb-10">
      <span class="inline-block w-125px">FinishedStatus:</span>
      <span class="pr-2 text-blue-500"><b class="text-blue-500">{{ finished }}</b></span>
    </div>
    <div clss="mb-10">
      <span class="inline-block w-125px">ArrivedStatus:</span>
      <span class="pr-2">Left : <b class="text-blue-500">{{ left }}</b></span>
      <span class="pr-2">Right : <b class="text-blue-500">{{ right }}</b></span>
      <span class="pr-2">Top : <b class="text-blue-500">{{ top }}</b></span>
      <span class="pr-2">Bottom : <b class="text-blue-500">{{ bottom }}</b></span>
    </div>
  </header>
  <ul ref="scrollRef" class="scroller">
    <li>VueUse</li>
    <li>Vue</li>
    <li>Vite</li>
    <li>VueCompositionAPI</li>
    <li>Awesome</li>
  </ul>
</template>

<style scoped>
.scroller {
  width: 500px;
  height: 300px;
  overflow:scroll;
}
li{
  list-style: none;
  width: 600px;
  height: 100px;
  text-indent: 200px;
  font-size: 16px;
  color:#ff8000;
}
</style>
