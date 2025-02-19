<script setup lang="ts">
import { useClipboard, usePermission } from '@vueuse/core'
import { shallowRef } from 'vue'

const input = shallowRef('')

const { text, isSupported, copy } = useClipboard()
const permissionRead = usePermission('clipboard-read')
const permissionWrite = usePermission('clipboard-write')
</script>

<template>
  <div v-if="isSupported">
    <note>
      Clipboard Permission: read <b>{{ permissionRead }}</b> | write
      <b>{{ permissionWrite }}</b>
    </note>
    <p>
      Current copied: <code>{{ text || 'none' }}</code>
    </p>
    <input v-model="input" type="text">
    <button @click="copy(input)">
      Copy
    </button>
  </div>
  <p v-else>
    Your browser does not support Clipboard API
  </p>
</template>
