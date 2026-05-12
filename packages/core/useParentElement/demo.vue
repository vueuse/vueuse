<script lang="ts" setup>
import { useElementBounding, useElementByPoint, useEventListener, useMouse, useParentElement } from '@vueuse/core'
import { computed, reactive } from 'vue'

const { x, y } = useMouse({ type: 'client' })
const { element } = useElementByPoint({ x, y })

const parentElement = useParentElement(element)

const parentBounding = reactive(useElementBounding(parentElement))

const currentElementBounding = reactive(useElementBounding(element))

useEventListener('scroll', [parentBounding.update, currentElementBounding.update], { passive: true, capture: true })

const currentElementBoxStyles = computed(() => {
  if (element.value) {
    return {
      display: 'block',
      width: `${currentElementBounding.width}px`,
      height: `${currentElementBounding.height}px`,
      left: `${currentElementBounding.left}px`,
      top: `${currentElementBounding.top}px`,
      backgroundColor: '#a5a5a544',
      transition: 'all 0.05s linear',
    } as Record<string, string | number>
  }
  return {
    display: 'none',
  }
})

const parentElementBoxStyles = computed(() => {
  if (parentElement.value) {
    return {
      display: 'block',
      width: `${parentBounding.width}px`,
      height: `${parentBounding.height}px`,
      left: `${parentBounding.left}px`,
      top: `${parentBounding.top}px`,
      backgroundColor: '#3eaf7c44',
      transition: 'all 0.05s linear',
    } as Record<string, string | number>
  }
  return {
    display: 'none',
  }
})
</script>

<template>
  <p>Current element tag: {{ element ? element.tagName : 'Finding...' }}</p>
  <p>Parent element tag: {{ parentElement ? parentElement.tagName : 'Finding...' }}</p>

  <div
    :style="parentElementBoxStyles"
    fixed
    pointer-events-none
    z-9999
    border="1 $vp-c-brand"
  />

  <div
    :style="currentElementBoxStyles"
    fixed
    pointer-events-none
    z-9999
    border="1 $vp-c-brand"
  />
</template>
