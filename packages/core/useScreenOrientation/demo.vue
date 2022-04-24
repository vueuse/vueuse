<script setup lang="ts">
import { useScreenOrientation } from '.'

const { orientation } = useScreenOrientation()
</script>

<template>
  <note class="mb-2">
    For best results, please use a mobile or tablet device (or use your browser's native inspector to simulate an orienatation change)
  </note>
  Orientation Type: <span class="font-bold">
    {{ orientation }}
  </span>
</template>
