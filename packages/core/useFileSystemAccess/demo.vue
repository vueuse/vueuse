<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import type { Ref } from 'vue'
import { reactive, ref } from 'vue'
import { useFileSystemAccess } from '.'

const dataType = ref('Text') as Ref<'Text' | 'ArrayBuffer' | 'Blob'>
const res = useFileSystemAccess({
  dataType,
  types: [{
    description: 'text',
    accept: {
      'text/plain': ['.txt', '.html'],
    },
  }],
  excludeAcceptAllOption: true,
})

const content = res.data
const str = stringify(reactive({
  isSupported: res.isSupported,
  file: res.file,
  fileName: res.fileName,
  fileMIME: res.fileMIME,
  fileSize: res.fileSize,
  fileLastModified: res.fileLastModified,
}))

async function onSave() {
  await res.save()
  alert('saved')
}
</script>

<template>
  <div>
    <button @click="res.create()">
      new file
    </button>
    <button @click="res.open()">
      open
    </button>
    <button @click="onSave">
      save
    </button>
    <button @click="res.saveAs()">
      save as
    </button>

    <div>
      choose dataType:
      <select v-model="dataType" class="border outline-none h-9 ml-5 w-50">
        <option value="Text">
          Text
        </option>
        <option value="ArrayBuffer">
          ArrayBuffer
        </option>
        <option value="Blob">
          Blob
        </option>
      </select>
    </div>

    <pre class="code-block" lang="yaml">{{ str }}</pre>

    <div>
      content:
      <textarea v-if="dataType ==='Text' " v-model="content" rows="20" cols="40" />
      <span v-else>{{ content }}</span>
    </div>
  </div>
</template>
