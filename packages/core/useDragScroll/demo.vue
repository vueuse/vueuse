<script setup lang="ts">
import { ref } from 'vue'
import { useDragScroll } from '@vueuse/core'
import { UseDragScroll } from './component'

const elRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLElement | null>(null)
useDragScroll(elRef)
useDragScroll(imgRef)
</script>

<template>
  <div class="flex gap-10">
    <div ref="elRef" class="w-300px h-300px overflow-auto">
      <p class="w-500px h-500px">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum, distinctio, rem! Asperiores autem beatae,
        consectetur deserunt ex exercitationem libero maiores nemo nihil non placeat quo reprehenderit ullam vel, vero
        voluptas voluptates! Aspernatur autem dolorem ducimus, ea, expedita illum laboriosam molestiae nesciunt nisi odit
        perspiciatis provident rem sapiente sed suscipit totam!
      </p>
    </div>
    <UseDragScroll class="w-300px h-300px overflow-auto">
      <img
        class="w-500px h-500px max-w-500px"
        src="https://source.unsplash.com/random/500x500
"
      >
    </UseDragScroll>
  </div>
</template>
