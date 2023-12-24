<script lang="ts" setup>
import { stringify } from '@vueuse/docs-utils'
import { toValue, watchThrottled } from '@vueuse/shared'
import { ref, watch } from 'vue'
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

const content = ref<string>('')

async function createDefault() {
  const file = await create(defaultFileProps)
  if (file)
    currentFile.value = file
  if (content.value)
    currentFile.value?.write(toValue(content.value))
}

async function saveAsDefault() {
  if (!currentFile.value)
    return
  const file = await saveAs(currentFile.value, defaultFileProps)
  currentFile.value = file
  if (content.value)
    currentFile.value?.write(toValue(content.value))
}

interface FileInfo {
  fileKind: 'file' | undefined
  fileName: string | undefined
  fileMIME: string | undefined
  fileSize: number | undefined
  fileLastModified: string | undefined
}

const fileInfo: Ref<FileInfo> = ref({
} as FileInfo)

const str = stringify(fileInfo)

async function updateFileInfo() {
  fileInfo.value = {
    fileKind: toValue(currentFile)?.kind,
    fileName: toValue(toValue(currentFile)?.name),
    fileMIME: toValue(await toValue(currentFile)?.MIME()),
    fileSize: toValue(await toValue(currentFile)?.size()),
    fileLastModified: new Date(toValue(await toValue(currentFile)?.lastModified()) || 0).toUTCString(),
  }
}

watch(currentFile, updateFileInfo)

watchThrottled(
  content,
  async (v) => {
    if (currentFile.value)
      await currentFile.value.write(toValue(v))
    await updateFileInfo()
  },
  { throttle: 1500 },
)
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

    <div v-if="typeof content === 'string'">
      Content
      <textarea
        v-if="typeof content === 'string'"
        v-model="content" rows="20" cols="40" w-full
      />
      <span v-else>{{ content }}</span>
    </div>
  </div>
</template>
