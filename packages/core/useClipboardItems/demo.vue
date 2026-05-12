<script setup lang="ts">
import { useClipboardItems, usePermission } from '@vueuse/core'
import { effect, shallowRef } from 'vue'

const input = shallowRef('')

const { content, isSupported, copy, read } = useClipboardItems()
const computedText = shallowRef('')
const computedMimeType = shallowRef('')
effect(() => {
  Promise.all(content.value.map(item => item.getType('text/plain')))
    .then(async (blobs) => {
      computedMimeType.value = blobs.map(blob => blob.type).join(', ')
      computedText.value = (await Promise.all(blobs.map(blob => blob.text()))).join(', ')
    })
})
const permissionRead = usePermission('clipboard-read')
const permissionWrite = usePermission('clipboard-write')

function createClipboardItems(text: string) {
  const mime = 'text/plain'
  const blob = new Blob([text], { type: mime })
  return new ClipboardItem({
    [mime]: blob,
  })
}
</script>

<template>
  <div v-if="isSupported">
    <note>
      Clipboard Permission: read <b>{{ permissionRead }}</b> | write
      <b>{{ permissionWrite }}</b>
    </note>
    <p>
      Current copied: <code>{{ (computedText && `${computedText} (mime: ${computedMimeType})`) || "none" }}</code>
    </p>
    <input v-model="input" type="text">
    <button
      @click="() => copy([createClipboardItems(input)])"
    >
      Copy
    </button>
    <button
      @click="() => read()"
    >
      Manual read
    </button>
  </div>
  <p v-else>
    Your browser does not support Clipboard API
  </p>
</template>
