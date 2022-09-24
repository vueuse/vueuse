<script setup lang="ts">
import { useNavigatorLanguage } from '@vueuse/core'

const { isSupported, language } = useNavigatorLanguage()
</script>

<template>
  <p>
    Supported: <BooleanDisplay :value="isSupported" />
  </p>
  <note class="mb-2">
    Navigator Language:
  </note>
  <div v-if="isSupported">
    <code class="mr-2">{{ language }}</code>
  </div>
  <div v-else>
    The Navigator.language API is not supported in your browser.
  </div>
</template>
