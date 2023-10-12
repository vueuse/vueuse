<script setup lang="ts">
import { ref } from 'vue'
import { useDropZone, useEventListener } from '@vueuse/core'

const filesData = ref<{ name: string; size: number; type: string; lastModified: number }[]>([])
const imageFilesData = ref<{ name: string; size: number; type: string; lastModified: number }[]>([])

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

function onImageDrop(files: File[] | null) {
  imageFilesData.value = []
  if (files) {
    imageFilesData.value = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }))
  }
}

const dropZoneRef = ref<HTMLElement>()
const imageDropZoneRef = ref<HTMLElement>()
const pngRef = ref()

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

useEventListener(pngRef, 'dragstart', (event) => {
  event.dataTransfer?.setData('image/png', '/vue.png')
})
const { isOverDropZone: isOverImageDropZone } = useDropZone(imageDropZoneRef, { dataTypes: ['image/png'], onDrop: onImageDrop })
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="w-full h-auto relative">
      <p>Drop files into dropZone</p>
      <img src="/favicon.ico" alt="Drop me">

      <div
        ref="dropZoneRef"
        class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6"
      >
        <div>
          isOverDropZone:
          <BooleanDisplay :value="isOverDropZone" />
        </div>
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
    <hr>
    <div class="w-full h-auto relative">
      <p>Drop image/png into dropZone</p>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <img ref="pngRef" src="/vue.png" alt="Drop me">
          <span>png file</span>
        </div>
        <div class="flex flex-col items-center">
          <img src="/favicon-32x32.png" alt="Drop me">
          <span>ico file</span>
        </div>
      </div>

      <div
        ref="imageDropZoneRef"
        class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6"
      >
        <div>
          isOverImageDropZone:
          <BooleanDisplay :value="isOverImageDropZone" />
        </div>
        <div class="flex flex-wrap justify-center items-center">
          <div v-for="(file, index) in imageFilesData" :key="index" class="w-200px bg-black-200/10 ma-2 pa-6">
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
