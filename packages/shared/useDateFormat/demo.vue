<script setup lang="ts">
import { useDateFormat, useNow } from '@vueuse/core'
import { ref } from 'vue'

const formatter = ref('dddd YYYY-MM-DD HH:mm:ss')
const lang = ref('en-US')
const formatted = useDateFormat(useNow(), formatter, { locales: lang })
</script>

<template>
  <p class="text-20px font-bold text-emerald-500">
    {{ formatted }}
  </p>
  <div class="flex flex-col">
    <span class="mr-5px text-18px">
      Formatter Editor :
    </span>
    <input v-model="formatter" type="text">
    <div space-x-4>
      <label class="radio">
        <input v-model="lang" value="en-US" type="radio">
        <span>English (US)</span>
      </label>
      <label class="radio">
        <input v-model="lang" value="fr" type="radio">
        <span>French</span>
      </label>
      <label class="radio">
        <input v-model="lang" value="de" type="radio">
        <span>German</span>
      </label>
    </div>
  </div>
</template>
