<script setup lang="ts">
import { ref } from 'vue-demi'
import { ternary } from 'vue-chemistry/boolean'
import { useElementVisibility } from '.'

const el = ref(null)
const isVisible = useElementVisibility(el)
const text = ternary(isVisible, 'inside', 'outside')
</script>

<template>
  <div ref="el" style="height: 200px">
    <note class="mb-2">
      Info on the right bottom corner
    </note>
    <div class="area">
      Target Element (scroll down)
    </div>
  </div>
  <div class="float">
    Element <b>{{ text }}</b> the viewport
  </div>
</template>
