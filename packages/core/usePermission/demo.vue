<script setup lang="ts">
import { computed, reactive } from 'vue-demi'
import YAML from 'js-yaml'
import { usePermission } from '.'

const geolocation = usePermission('geolocation')
const microphone = usePermission('microphone')
const notifications = usePermission('notifications')
const camera = usePermission('camera')
const midi = usePermission('midi')

const code = computed(() => YAML.dump(reactive({
  geolocation,
  microphone,
  notifications,
  camera,
  midi,
})))
</script>

<template>
  <pre>{{ code }}</pre>
</template>
