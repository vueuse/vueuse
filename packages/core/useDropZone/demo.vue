<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import { ref } from 'vue'

const filesData = ref<{ name: string, size: number, type: string, lastModified: number }[]>([])
const imageFilesData = ref<{ name: string, size: number, type: string, lastModified: number }[]>([])

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

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

const { isOverDropZone: isOverImageDropZone } = useDropZone(imageDropZoneRef, { dataTypes: ['image/png'], onDrop: onImageDrop })
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="w-full h-auto relative">
      <p>Drop files from your computer on to drop zones</p>

      <div grid="~ cols-2 gap-2">
        <div
          ref="dropZoneRef"
          class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6 rounded"
        >
          <div font-bold mb2>
            General DropZone
          </div>
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
        <div
          ref="imageDropZoneRef"
          class="flex flex-col w-full min-h-200px h-auto bg-gray-400/10 justify-center items-center mt-6 rounded"
        >
          <div font-bold mb2>
            Image DropZone
          </div>
          <div>
            isOverDropZone:
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
  </div>
</template>
