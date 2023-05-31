<script lang="ts" setup>
import { stringify } from '@vueuse/docs-utils'
import { computedAsync } from '@vueuse/core'
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import type { FsFile, UseSaveFilePickerOpenOptions } from '../index.js'
import { useSaveFilePicker } from '../index.js'

const {
  isSupported,
  create,
  saveAs,
} = useSaveFilePicker()

const currentFile: Ref<FsFile | undefined> = ref()
const defaultFileProps: UseSaveFilePickerOpenOptions = {
  suggestedName: 'example_text_file.txt',
  types: [{
    description: 'text',
    accept: {
      'text/plain': ['.txt', '.html'],
    },
  }],
  excludeAcceptAllOption: false,
}

async function createDefault() {
  const file = await create(defaultFileProps)
  if (file)
    currentFile.value = file
}

async function saveAsDefault() {
  if (!currentFile.value)
    return
  const file = await saveAs(currentFile.value, defaultFileProps)
  currentFile.value = file
}

const content = computedAsync(() => currentFile.value?.text.value)
const str = stringify(reactive({
  fileKind: currentFile.value?.kind,
  fileName: currentFile.value?.name,
  fileMIME: currentFile.value?.MIME,
  fileSize: currentFile.value?.size,
  fileLastModified: currentFile.value?.lastModified,
}))
</script>

<template>
  <div v-if="!isSupported">
    <note
      class="mb-3"
    >
      <pre>showSaveFilePicker</pre> is not supported in your browser
    </note>
  </div>
  <div v-else>
    <div flex="~ gap-1" items-center>
      <button @click="createDefault()">
        New file
      </button>
      <button :disabled="!currentFile" @click="saveAsDefault()">
        Save as
      </button>
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
