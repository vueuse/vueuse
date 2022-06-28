<script lang="ts" setup>
import { useImage } from '@vueuse/core'
import { ref } from 'vue'

const imageOptions = ref({ src: 'https://place.dog/300/200' })
const { isLoading, error } = useImage(imageOptions, { delay: 2000 })

const change = () => {
  const time = new Date().getTime()
  imageOptions.value.src = `https://place.dog/300/200?t=${time}`
}
</script>

<template>
  <div v-if="isLoading" class="w-[300px] h-[200px] animate-pulse bg-gray-500/5 p-2">
    Loading...
  </div>
  <div v-else-if="error">
    Failed
  </div>
  <img v-else :src="imageOptions.src" class="w-[300px] h-[200px]">

  <button @click="change">
    Change
  </button>
</template>
