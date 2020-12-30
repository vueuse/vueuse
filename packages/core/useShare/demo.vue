<script setup lang="ts">
import { ref } from 'vue-demi'
import { useShare } from '.'
import { isClient } from '..'

const options = ref({
  title: 'Vueuse',
  text: 'Collection of essential Vue Composition Utilities!',
  url: isClient ? location.href : '',
})

const startShare = () => share().catch(err => err)

const { share, isSupported } = useShare(options)
</script>

<template>
  <div>
    <input
      v-if="isSupported"
      v-model="options.text"
      type="text"
      placeholder="Note"
    >
    <button :disabled="!isSupported" @click="startShare">
      {{ isSupported ? 'Share' : 'Web share not supported!' }}
    </button>
  </div>
</template>
