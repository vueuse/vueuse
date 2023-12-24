<script lang="ts" setup>
import { ref, shallowRef } from 'vue'
import type { FsHandle } from '../index.js'
import type { FileHandleKind } from '../types.js'
import { useDirectoryPicker } from '../index.js'

const {
  isSupported,
  open,
} = useDirectoryPicker()

const StartInChoices = ['desktop', 'documents', 'downloads', 'music', 'pictures', 'videos'] as const

const openWritable = ref(false)
const startIn = ref(StartInChoices[1])

const handles = shallowRef<FsHandle<FileHandleKind>[]>([])

async function openDirectory() {
  const _dir = await open({
    startIn: startIn.value,
    mode: openWritable.value ? 'readwrite' : 'read',
  })
  const result: FsHandle<FileHandleKind>[] = []
  const x = (await _dir?.allValues())?.[0]
  if (_dir) {
    for await (const handle of _dir.entries) {
      if (handle)
        result.push(handle[1])
    }
  }
  handles.value = result
}
</script>

<template>
  <div v-if="!isSupported">
    <note
      class="mb-3"
    >
      <pre>showOpenDirectoryPicker</pre> is not supported in your browser
    </note>
  </div>
  <div v-else>
    <div flex="~ gap-1" items-center>
      <label class="checkbox">
        <input v-model="openWritable" type="checkbox">
        <span>Also Request Write Access</span>
      </label>
    </div>
    <div>
      <span>Start In (well-known directory name):</span>
      <select v-model="startIn" px-4 py-n2 m-2 h-9 rounded appearance-none border-2 border-gray-400>
        <option v-for="(dirName, index) in StartInChoices" :key="index" bg="$vp-c-bg" :value="dirName">
          {{ dirName }}
        </option>
      </select>
    </div>
    <div flex="~ gap-1" items-center>
      <button @click="openDirectory()">
        Open Directory
      </button>
    </div>
    <br>
    <div>
      <div flex="~ gap-1" items-center>
        <span>Directory Contents:</span>
      </div>
      <div v-if="handles.length > 0">
        <div v-for="(handle, index) in handles" :key="index" flex="~ gap-1" items-center>
          <div bg="dark:(dark-300) light-700" mr-2 border="1 light-900 dark:(dark-700)" rounded relative flex items-center p-2 pl-8 pr-4 m-2>
            <i v-if="handle.kind === 'directory'" i-carbon-folder absolute left-2 />
            <i v-else i-carbon-document absolute left-2 />
            <div flex="~ gap-1" items-center>
              <span>{{ handle.name.value }}</span>
            </div>
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
