<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { useShare } from '.'

const options = ref({
  title: 'Vueuse',
  text: 'Collection of essential Vue Composition Utilities!',
  url: location.href,
})
const { share, isSupported } = useShare(options)

const startShare = () => share().catch((err) => err),
  options,
  isSupported
</script>

<template>
  <div>
    <input
      v-if="isSupported"
      v-model="options.text"
      type="text"
      placeholder="Note"
    />
    <button :disabled="!isSupported" @click="startShare">
      {{ isSupported ? 'Share' : 'Web share not supported!' }}
    </button>
  </div>
</template>
