<script setup lang="ts">
import { ref } from 'vue'
import Blueprint from '../blueprint.vue'
import { useSquare } from '.'

const size = ref(300)
const center = ref({ x: 0, y: 0 })
const { vertices, edges } = useSquare(size, center)
</script>

<template>
  <div>
    <Blueprint :vertices="vertices" :edges="edges" />
    <div class="mt-4 control-area">
      <h4 class="mb-3">
        Parameters
      </h4>
      <div class="control-group">
        <label class="mr-2">Size: <span>{{ size }}</span></label>
        <input v-model="size" class="slider" type="range" min="0" max="500">
      </div>
      <div class="control-group">
        <label class="mr-2">Center X: <span>{{ center.x }}</span></label>
        <input v-model="center.x" class="slider" type="range" min="-200" max="200">
      </div>
      <div class="control-group">
        <label class="mr-2">Center Y: <span>{{ center.y }}</span></label>
        <input v-model="center.y" class="slider" type="range" min="-200" max="200">
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '../demo-styles.css';
</style>
