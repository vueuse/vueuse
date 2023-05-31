<script setup lang="ts">
import { ref } from 'vue'
import { useDropZone } from '@vueuse/core'

const filesData = ref<{ name: string; size: number; type: string; lastModified: number }[]>([])
function onDrop(files: File[] | null) {
  filesData.value = []
  if (files) {
    filesData.value = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }))
  }
}

const dropZoneRef = ref<HTMLElement>()

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
</script>

<template>
  <div class="flex">
    <div class="w-full h-auto relative">
      <p>Drop files into dropZone</p>
      <img src="/favicon.ico" alt="Drop me">

      <div ref="dropZoneRef" class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6">
        <div> isOverDropZone: <BooleanDisplay :value="isOverDropZone" /></div>
        <div class="flex flex-wrap justify-center items-center">
          <div v-for="(file, index) in filesData" :key="index" class="w-200px bg-black-200/10 ma-2 pa-6">
            <p>Name: {{ file.name }}</p>
            <p>Size: {{ file.size }}</p>
            <p>Type: {{ file.type }}</p>
            <p>Last modified: {{ file.lastModified }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
