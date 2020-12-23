<script setup lang="ts">
import { defineComponent, ref } from 'vue-demi'
import { useClipboard, usePermission } from '..'

const ...useClipboard(),
        permissionRead = usePermission('clipboard-read'),
        permissionWrite = usePermission('clipboard-write'),
        input = ref(''),
</script>

<template>
  <div v-if="isSupported">
    <note
      >Clipboard Permission: read <b>{{ permissionRead }}</b> | write
      <b>{{ permissionWrite }}</b></note
    >
    <p>
      Current copied: <code>{{ text || 'none' }}</code>
    </p>
    <input v-model="input" type="text" />
    <button @click="copy(input)">Copy</button>
  </div>
  <p v-else>Your browser does not support Clipboard API</p>
</template>
