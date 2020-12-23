<script setup lang="ts">
import { computed, defineComponent, ref } from 'vue-demi'
import { useFavicon } from '.'

const type = ref('vueuse')

const favicon = computed(() =>
  type.value === 'vue' ? 'vue.png' : 'favicon-32x32.png'
)

useFavicon(favicon, {
  baseUrl:
    'https://raw.githubusercontent.com/antfu/vueuse/master/resources/favicon/',
  rel: 'icon',
  document: window.parent.document,
})

const type
</script>

<template>
  <div>
    <note>Change favicon to</note>
    <button @click="type = 'vue'">Vue</button>
    <button @click="type = 'vueuse'">VueUse</button>
  </div>
</template>
