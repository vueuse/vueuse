<script lang="ts" setup>
import { toValue } from '@vueuse/shared'
import { reactive, ref, shallowRef } from 'vue'
import type { FsFile } from '../index.js'
import type { FileSystemAccessShowOpenFileOptions } from '../types.js'
import { useOpenFilePicker } from '../index.js'
import { knownTypes } from './demo.knownFileTypes.js'

const {
  isSupported,
  open,
} = useOpenFilePicker()

const OpenOptions = reactive<FileSystemAccessShowOpenFileOptions>({
  multiple: false,
  types: [knownTypes[0]],
  excludeAcceptAllOption: false,
})

const files = shallowRef<[string, FsFile][]>([])

async function openFiles() {
  const _files = await open(OpenOptions)
  const result: [string, FsFile][] = []
  if (_files) {
    for (const file of _files) {
      if (file) {
        const fileInfo = await getFileInfo(file)
        result.push([fileInfo, file])
      }
    }
  }
  files.value = result
}

interface FileInfo {
  fileKind: 'file' | undefined
  fileName: string | undefined
  fileMIME: string | undefined
  fileSize: number | undefined
  fileLastModified: string | undefined
}

async function getFileInfo(file: FsFile) {
  return JSON.stringify({
    fileKind: toValue(file)?.kind,
    fileName: toValue(toValue(file)?.name),
    fileMIME: toValue(await toValue(file)?.MIME()),
    fileSize: toValue(await toValue(file)?.size()),
    fileLastModified: new Date(toValue(await toValue(file)?.lastModified()) || 0).toUTCString(),
  } as FileInfo, undefined, 2)
}

const selectedFileType = ref(knownTypes[0])
</script>

<template>
  <div v-if="!isSupported">
    <note
      class="mb-3"
    >
      <pre>showOpenFilePicker</pre> is not supported in your browser
    </note>
  </div>
  <div v-else>
    <div flex="~ gap-1" items-center>
      <label class="checkbox">
        <input v-model="OpenOptions.multiple" type="checkbox">
        <span>Allow Multiple files to be selected</span>
      </label>
    </div>
    <div flex="~ gap-1" items-center>
      <label class="checkbox">
        <input v-model="OpenOptions.excludeAcceptAllOption" type="checkbox">
        <span>Do not alow user to use `Allow All` file-type option</span>
      </label>
    </div>
    <div flex="~ gap-1" items-center mt-4>
      <span>Allowed File Types:</span>
    </div>
    <div py-2>
      <div>
        <select v-model="selectedFileType" px-4 py-n2 m-2 h-9 rounded appearance-none border-2 border-gray-400>
          <option v-for="(knownType, index) in knownTypes" :key="index" bg="$vp-c-bg" :value="knownType">
            {{ knownType.description }} ({{ Object.keys(knownType.accept)[0] }})
          </option>
        </select>
        <button @click="OpenOptions.types?.push(selectedFileType)">
          Add File Type
        </button>
      </div>
      <div v-for="(fileType, index) in OpenOptions.types" :key="index" px-4 py-1 flex flex-col>
        <span>{{ fileType.description }} ({{ Object.keys(fileType.accept)[0] }}):
          <code>{{ fileType.accept[Object.keys(fileType.accept)[0]].join(', ') }}</code></span>
      </div>
    </div>
    <div flex="~ gap-1" items-center>
      <button @click="openFiles()">
        Open File(s)
      </button>
    </div>
    <br>
    <div>
      <div flex="~ gap-1" items-center>
        <span>Selected Files:</span>
      </div>
      <div v-if="files.length > 0">
        <div v-for="(file, index) in files" :key="index" flex="~ gap-1" items-center>
          <div flex="~ gap-1" items-center>
            <pre class="code-block" lang="yaml">{{ file[0] }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
input {
  --tw-ring-offset-width: 1px !important;
  --tw-ring-color: #8885 !important;
  --tw-ring-offset-color: transparent !important;
}

.checkbox {
  @apply inline-flex items-center my-auto cursor-pointer select-none;
}

.checkbox input {
  appearance: none;
  padding: 0;
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  display: inline-block;
  vertical-align: middle;
  background-origin: border-box;
  user-select: none;
  flex-shrink: 0;
  height: 1rem;
  width: 1rem;
  @apply bg-gray-400/30;
  @apply rounded-md h-4 w-4 select-none;
}

.checkbox input:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}

.checkbox span {
  @apply ml-1.5 text-13px opacity-70;
}
</style>
