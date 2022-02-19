<script setup lang="ts">
import { nextTick, ref, unref } from 'vue-demi'
import { useTemplateRefsList } from '@vueuse/core'
import { useDragIntoElement } from '.'

const material = ['Vue', 'Vite', 'VueUse']

const dropElement = ref<HTMLElement | null>(null)
const elements = ref<any>([])

const refs = useTemplateRefsList<HTMLDivElement>()
const materialRefs = useTemplateRefsList<HTMLDivElement>()

nextTick(() => {
  materialRefs.value.forEach((itemRef) => {
    useDragIntoElement(itemRef, dropElement, {
      onDrop({ left, top }) {
        elements.value.push({
          name: unref(itemRef)?.innerText,
          left,
          top,
        })
        nextTick(() => {
          const index = refs.value.length - 1
          useDragIntoElement(refs.value[index], dropElement, {
            onDrop({ left, top }) {
              elements.value[index].left = left
              elements.value[index].top = top
            },
          })
        })
      },
    })
  })
})

</script>

<template>
  <h3 class="text-primary">
    Draggable Element :
  </h3>
  <div>
    <span
      v-for="(item,index) in material"
      :ref="materialRefs.set"
      :key="index"
      draggable="true"
      class="text-orange-400 mr-10 cursor-pointer"
    >
      {{ item }}
    </span>
  </div>

  <h3 class="text-primary">
    Drop Zone :
  </h3>

  <div ref="dropElement" class="relative h-50 border-1 border-solid border-red-400/30">
    <!--  -->
  </div>

  <teleport v-if="dropElement" :to="dropElement">
    <span
      v-for="(item,index) in elements"
      :ref="refs.set"
      :key="index"
      draggable="true"
      class="text-orange-400 cursor-pointer"
      :style="{left:`${item.left}px`,top:`${item.top}px`,position:'absolute'}"
    >
      {{ item.name }}
    </span>
  </teleport>
</template>
