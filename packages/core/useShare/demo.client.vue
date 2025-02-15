<script setup lang="ts">
import { useShare } from '@vueuse/core'
import { isClient } from '@vueuse/shared'
import { ref as deepRef } from 'vue'

const options = deepRef({
  title: 'VueUse',
  text: 'Collection of essential Vue Composition Utilities!',
  url: isClient ? location.href : '',
})

const { share, isSupported } = useShare(options)

function startShare() {
  return share().catch(err => err)
}
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
      {{ isSupported ? 'Share' : 'Web share is not supported in your browser' }}
    </button>
  </div>
</template>
