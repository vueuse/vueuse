<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard, usePermission } from '@vueuse/core'

const input = ref('')

const { text, isClipboardApiSupported, isClipboardReadSupported, copy } = useClipboard({ read: true, legacy: true })
const permissionRead = usePermission('clipboard-read')
const permissionWrite = usePermission('clipboard-write')
</script>

<template>
  <note>
    <p>Clipboard Permission: read <b>{{ permissionRead }}</b> | write <b>{{ permissionWrite }}</b></p>
    <p v-if="!isClipboardApiSupported">
      Your browser does not support Clipboard API. <code>document.execCommand("copy")</code> will be used.
    </p>
    <p v-if="!isClipboardReadSupported">
      Your browser does not support <code>navigator.clipboard.readText()</code>. Legacy method will be used.
    </p>
  </note>

  <div class="example">
    <p>Current copied: <code>{{ text || 'none' }}</code></p>
    <input v-model="input" type="text">
    <button @click="copy(input)">
      Copy
    </button>
  </div>
</template>
