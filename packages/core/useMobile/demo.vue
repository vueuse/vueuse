<script setup lang="ts">
import { computed, reactive } from 'vue'
import YAML from 'js-yaml'
import { useMobile } from '@vueuse/core'

const { isAndroid, isIOS, isDesktop } = useMobile()

const code = computed(() => YAML.dump(reactive({
  isAndroid,
  isIOS,
  isDesktop,
})))
</script>

<template>
  <pre lang="json">{{ code }}</pre>
</template>
