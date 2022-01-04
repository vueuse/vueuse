<script setup lang="ts">
import { useHash } from '.'

const { hash, setHash } = useHash()
</script>

<template>
  <div>{{ hash }}</div>
</template>
