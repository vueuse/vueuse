<script setup lang="ts">
import type { NDEFRecord } from '@vueuse/core'
import { useWebNFC } from '@vueuse/core'
import { computed, shallowRef } from 'vue'

const {
  isSupported,
  isScanning,
  serialNumber,
  records,
  error,
  scan,
  stop,
  write,
} = useWebNFC()

function decode(record: NDEFRecord) {
  if (!record.data)
    return ''
  if (record.recordType === 'text' || record.recordType === 'url')
    return new TextDecoder(record.encoding ?? 'utf-8').decode(record.data)
  return `${record.data.byteLength} bytes`
}

function toHex(data?: DataView) {
  if (!data)
    return ''
  return Array.from(new Uint8Array(data.buffer, data.byteOffset, data.byteLength))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join(' ')
}

const decodedRecords = computed(() => records.value.map(record => ({
  type: record.mediaType ?? record.recordType,
  value: decode(record),
  bytes: toHex(record.data),
})))

const text = shallowRef('Hello VueUse')
const isWriting = shallowRef(false)
const writeStatus = shallowRef('')

async function writeText() {
  isWriting.value = true
  writeStatus.value = 'Tap a tag to write…'
  try {
    await write(text.value)
    writeStatus.value = 'Written!'
  }
  catch {
    writeStatus.value = 'Writing failed'
  }
  finally {
    isWriting.value = false
  }
}
</script>

<template>
  <div v-if="!isSupported">
    Your browser does not support the Web NFC API. Try Chrome on Android.
  </div>
  <div v-else class="grid gap-4">
    <div>
      <button v-if="!isScanning" @click="scan">
        Start scan
      </button>
      <button v-else @click="stop">
        Stop scan
      </button>
      <span class="ml-2 opacity-75">{{ isScanning ? 'Scanning, tap a tag…' : 'Not scanning' }}</span>
    </div>

    <div v-if="serialNumber">
      <div>Serial number: <code>{{ serialNumber }}</code></div>
      <ul v-if="decodedRecords.length">
        <li v-for="(record, index) in decodedRecords" :key="index">
          <code>{{ record.type }}</code>: {{ record.value }}
          <pre v-if="record.bytes" class="text-xs whitespace-pre-wrap break-all">{{ record.bytes }}</pre>
        </li>
      </ul>
      <div v-else class="opacity-75">
        No NDEF records on this tag. Web NFC only exposes the serial number for tags that are empty or not NDEF formatted.
      </div>
    </div>

    <div>
      <input v-model="text" type="text" placeholder="Text to write">
      <button :disabled="isWriting" @click="writeText">
        Write
      </button>
      <span v-if="writeStatus" class="ml-2 opacity-75">{{ writeStatus }}</span>
    </div>

    <pre v-if="error">{{ error }}</pre>
  </div>
</template>
