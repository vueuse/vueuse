<script setup lang="ts">
import { ref } from 'vue'
import { useUniqueId } from '@vueuse/core'

const prefix = ref('prefix_')
const uniqueId = useUniqueId(prefix)

</script>

<template>
  <div>
    <input v-model="prefix" type="text">
  </div>
  <div>
    uniqueId: {{ uniqueId }}
  </div>
</template>
