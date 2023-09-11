<script setup lang="ts">
import { ref } from 'vue'
import Blueprint from '../demo/blueprint.vue'
import { useSquare } from '.'

const size = ref(300)
const center = ref({ x: 0, y: 0 })
const { vertices, edges } = useSquare(size, center)
</script>

<template>
  <div>
    <Blueprint :vertices="vertices" :edges="edges" />
    <div class="mt-4">
      <h4 class="mb-3">
        Parameters
      </h4>
      <div class="mb-3">
        <label class="mr-2">Side Length: <span style="display: inline-block; width: 40px; font-weight: bold">{{ size }}</span></label>
        <input v-model="size" class="slider" type="range" min="0" max="500">
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
