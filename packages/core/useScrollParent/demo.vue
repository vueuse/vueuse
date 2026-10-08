<script setup lang="ts">
import { useScrollParent } from '@vueuse/core'
import { useTemplateRef } from 'vue'

const scrollYAxisEl = useTemplateRef('scrollYAxisEl')
const scrollXAxisEl = useTemplateRef('scrollXAxisEl')
const scrollY = useScrollParent(scrollYAxisEl)
const scrollX = useScrollParent(scrollXAxisEl)
</script>

<template>
  <div class="flex h-160px py-4">
    <div class="w-1/2 flex-shrink-0 border-r-dashed border-main mr-4">
      <div v-if="scrollY" class="res text-ellipsis whitespace-nowrap overflow-hidden">
        {{ scrollY.y?.classList }}
      </div>
      <div class="scroll-y flex overflow-y-auto h-full">
        <div ref="scrollYAxisEl" class="content">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
        </div>
      </div>
    </div>
    <div class="w-1/2 flex-shrink-0">
      <div v-if="scrollX" class="res text-ellipsis whitespace-nowrap overflow-hidden">
        {{ scrollX.x?.className }}
      </div>
      <div class="scroll-x flex overflow-x-auto h-full w-full">
        <div ref="scrollXAxisEl" class="content flex space-x-4xl">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
        </div>
      </div>
    </div>
  </div>
</template>
