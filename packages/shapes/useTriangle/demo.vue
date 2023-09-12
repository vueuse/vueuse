<script setup lang="ts">
import { ref } from 'vue'
import Blueprint from '../blueprint.vue'
import { useTriangle } from '.'

const baseLength = ref(300)
const center = ref({ x: 0, y: 0 })
const { vertices, edges } = useTriangle(baseLength, center)
</script>

<template>
  <div>
    <Blueprint :vertices="vertices" :edges="edges" />
    <div class="mt-4">
      <h4 class="mb-3">
        Parameters
      </h4>
      <div class="mb-3">
        <label class="mr-2">Base Length: <span style="display: inline-block; width: 40px; font-weight: bold">{{ baseLength }}</span></label>
        <input v-model="baseLength" class="slider" type="range" min="0" max="500">
      </div>
      <div class="mb-3">
        <label class="mr-2">Center X: <span style="display: inline-block; width: 40px; font-weight: bold">{{ center.x }}</span></label>
        <input v-model="center.x" class="slider" type="range" min="-200" max="200">
      </div>
      <div>
        <label class="mr-2">Center Y: <span style="display: inline-block; width: 40px; font-weight: bold">{{ center.y }}</span></label>
        <input v-model="center.y" class="slider" type="range" min="-200" max="200">
      </div>
    </div>
  </div>
</template>
