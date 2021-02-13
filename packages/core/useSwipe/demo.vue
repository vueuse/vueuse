
<script setup lang="ts">
import { ref } from 'vue'
import { useSwipe } from '.'

const el = ref(null)

const { direction, isSwiping, lengthX, lengthY } = useSwipe(el)
</script>

<template>
  <div>
    <div ref="el" class="container" :class="{highlight: isSwiping}">
      <p class="notice">
        Swipe here
      </p>
    </div>
    <p class="status">
      Direction: {{ direction? direction : '-' }} <br>
      lengthX: {{ lengthX }} | lengthY: {{ lengthY }}
    </p>
  </div>
</template>

<style scoped>
.container {
  border: 2px dashed #ccc;
  height: 100;
}

.container.highlight {
  transition: border-color 0.2s linear;
  border-color: #3fb983;
}

.notice {
  text-align: center;
  font-style: italic;
  color: #ccc;
}

.status {
  text-align: center;
}
</style>
