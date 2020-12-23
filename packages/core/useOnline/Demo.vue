<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { useOnline } from '.'

const online = useOnline()
</script>

<template>
  <div>
    <p>{{ online ? 'Online' : 'Offline' }}</p>
  </div>
</template>
