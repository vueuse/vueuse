<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useWindowSize } from '.'

return useWindowSize()
</script>

<template>
  <div>
    <p>{{ width }} x {{ height }}</p>
  </div>
</template>
