<script setup lang="ts">
import { ref } from 'vue-demi'
import { useIntersectionObserver } from '.'

const root = ref(null)
const target = ref(null)
const isVisible = ref(false)

const stopObserver = useIntersectionObserver(
  target,
  ([{ isIntersecting }], observerElement) => {
    isVisible.value = isIntersecting
  },
  { root },
)
</script>

<template>
  <div>
    <div ref="root" class="root">
      <p style="text-align: center">
        Scroll me!
      </p>
      <div ref="target" class="target">
        <h1>Hello world</h1>
      </div>
    </div>
    <div class="text-center">
      {{ isVisible ? "Inside the viewport" : "Outside the viewport" }}
    </div>
  </div>
</template>

<style scoped>
.root {
  border: 2px dashed #ccc;
  max-height: 150px;
  margin: 0 2rem 1rem;
  overflow-y: scroll;
}
.target {
  border: 2px dashed #ccc;
  max-height: 150px;
  margin: 0 2rem 1rem;
  overflow-y: scroll;
}
</style>
