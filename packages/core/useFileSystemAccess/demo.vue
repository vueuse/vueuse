<script setup lang="ts">
import { stringify } from '@vueuse/docs-utils'
import type { Ref } from 'vue'
import { reactive, ref } from 'vue'
import { useFileSystemAccess } from '@vueuse/core'

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
}
</script>

<template>
  <div>
    <div flex="~ gap-1" items-center>
      <button @click="res.open()">
        Open
      </button>
      <button @click="res.create()">
        New file
      </button>
      <button :disabled="!res.file.value" @click="onSave">
        Save
      </button>
      <button :disabled="!res.file.value" @click="res.saveAs()">
        Save as
      </button>

      <div ml5>
        <div text-xs op50>
          DataType
        </div>
        <select v-model="dataType" class="outline-none w-30 px2 py1 text-sm" border="~ main rounded">
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
    </div>

    <pre class="code-block" lang="yaml">{{ str }}</pre>

    <div v-if="content">
      Content
      <textarea
        v-if="typeof content === 'string'"
        v-model="content" rows="20" cols="40" w-full
      />
      <span v-else>{{ content }}</span>
    </div>
  </div>
</template>
