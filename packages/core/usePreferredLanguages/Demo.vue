<script setup lang="ts">
import { defineComponent } from 'vue-demi'
import { usePreferredLanguages } from '.'

const usePreferredLanguages = usePreferredLanguages()
</script>

<template>
  <div>
    <p>
      Preferred Languages: <code>{{ usePreferredLanguages.join(', ') }}</code>
    </p>
  </div>
</template>
