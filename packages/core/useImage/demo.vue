<script lang="ts" setup>
import { useImage } from '@vueuse/core'
import { ref } from 'vue'

const imageOptions = ref({ src: 'https://place-hold.it/300x200' })
const colors = ['fff', '000', '5f0caa']
const { isLoading, error } = useImage(imageOptions, { delay: 1000 })

function change() {
  imageOptions.value.src = ''
  const color: string = colors[Math.floor(Math.random() * colors.length)]
  imageOptions.value.src = `https://place-hold.it/300x200/${color}`
}
</script>

<template>
  <div v-if="isLoading" class="w-[300px] h-[200px] animate-pulse bg-gray-500/5 p-2">
    Loading...
  </div>
  <div v-else-if="error" class="text-red">
    Failed
  </div>
  <img v-else :src="imageOptions.src" class="w-[300px] h-[200px]">

  <button @click="change">
    Change
  </button>

  <button @click="imageOptions.src = ''">
    Create Error
  </button>
</template>
