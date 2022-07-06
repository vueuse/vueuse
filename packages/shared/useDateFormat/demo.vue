<script setup lang="ts">
import { ref } from 'vue'
import { useDateFormat, useNow } from '@vueuse/core'

const formatter = ref('YYYY-MM-DD HH:mm:ss')
const formatted = useDateFormat(useNow(), formatter)
</script>

<template>
  <p class="text-20px font-bold text-emerald-500">
    {{ formatted }}
  </p>
  <div class="flex items-center">
    <span class="mr-5px text-18px">
      Formatter Editor :
    </span>
    <input v-model="formatter" type="text">
  </div>
</template>
