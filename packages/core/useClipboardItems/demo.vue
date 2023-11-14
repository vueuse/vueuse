<script setup lang="ts">
import { effect, ref } from 'vue'
import { useClipboardItems, usePermission } from '@vueuse/core'

const input = ref('')

const { content, isSupported, copy } = useClipboardItems()
const computedText = ref('')
effect(() => {
  Promise.all(content.value.map(item => item.getType('text/html')))
    .then((blobs) => {
      return Promise.all(blobs.map(blob => blob.text()))
    })
    .then((texts) => {
      computedText.value = texts.join('')
    })
})
const permissionRead = usePermission('clipboard-read')
const permissionWrite = usePermission('clipboard-write')

function createClipboardItems(text: string) {
  const mime = 'text/html'
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
      Current copied: <code>{{ (computedText && `${computedText} (mime: text/html)`) || "none" }}</code>
    </p>
    <input v-model="input" type="text">
    <button
      @click="
        copy([createClipboardItems(input)])
      "
    >
      Copy
    </button>
  </div>
  <p v-else>
    Your browser does not support Clipboard API
  </p>
</template>
