<script setup lang="ts">
import { useUserAgent } from '.'

const { name, version, os } = useUserAgent()
</script>

<template>
  <div>
    <p>
      Browser:
      <b class="text-primary">{{ name }}</b>
    </p>
    <p>
      Version:
      <b class="text-primary">{{ version }}</b>
    </p>
    <p>
      OS:
      <b class="text-primary">{{ os }}</b>
    </p>
  </div>
</template>
