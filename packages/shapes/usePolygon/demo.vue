<script setup lang="ts">
import { ref } from 'vue'
import Blueprint from '../blueprint.vue'
import { usePolygon } from '.'

const sideLength = ref(150)
const sides = ref(5)
const center = ref({ x: 0, y: 0 })
const rotation = ref(0)
const { vertices, edges } = usePolygon({ sideLength, sides, center, rotation })
</script>

<template>
  <div>
    <Blueprint :vertices="vertices" :edges="edges" />
    <div class="mt-4 control-area">
      <h4 class="mb-3">
        Parameters
      </h4>
      <div class="control-group">
        <label class="mr-2">Size: <span>{{ sideLength }}</span></label>
        <input v-model="sideLength" class="slider" type="range" min="0" max="500">
      </div>
      <div class="control-group">
        <label class="mr-2">Number of Sides: <span>{{ sides }}</span></label>
        <input v-model="sides" class="slider" type="range" min="3" max="12">
      </div>
      <div class="control-group">
        <label class="mr-2">Rotation: <span>{{ rotation }}</span></label>
        <input v-model="rotation" class="slider" type="range" min="0" max="360">
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
