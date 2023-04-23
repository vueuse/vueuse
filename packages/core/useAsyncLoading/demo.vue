<script setup lang="ts">
import { useAsyncLoading } from '@vueuse/core'

const { asyncLoading, showLoading, hideLoading } = useAsyncLoading()

showLoading()

setTimeout(() => {
  hideLoading()
}, 500)
</script>

<template>
  <div>
    <div>
      {{ asyncLoading }}
    </div>
    <!-- if use like `Element-Plus` -->
    <!-- <div v-loading="asyncLoading"></div> -->
  </div>
</template>
