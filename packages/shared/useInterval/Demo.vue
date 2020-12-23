<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useInterval } from '.'

return useInterval(200)
</script>

<template>
  <div>
    <p>Interval fired: {{ counter }}</p>
  </div>
</template>
