---
category: Browser
---

# useWebNFC

Reactive [Web NFC API](https://developer.mozilla.org/en-US/docs/Web/API/Web_NFC_API). Read and write NDEF messages on NFC tags.

Web NFC is currently only available in Chrome on Android. It requires a secure context (HTTPS) and only works while the page is visible. The first `scan()` or `write()` prompts the user for permission, so it is best triggered by a user interaction.

Web NFC talks to passive NFC tags (stickers, cards, key fobs). It does not support communication between two devices.

## Usage

```vue
<script setup lang="ts">
import { useWebNFC } from '@vueuse/core'

const {
  isSupported,
  isScanning,
  serialNumber,
  records,
  error,
  scan,
  stop,
} = useWebNFC()
</script>

<template>
  <div v-if="!isSupported">
    Web NFC is not supported
  </div>
  <template v-else>
    <button v-if="!isScanning" @click="scan">
      Start scan
    </button>
    <button v-else @click="stop">
      Stop scan
    </button>
    <p v-if="serialNumber">
      Serial number: {{ serialNumber }} ({{ records.length }} records)
    </p>
    <p v-if="error">
      Error: {{ error }}
    </p>
  </template>
</template>
```

Scanning stops automatically when the component is unmounted. Pass `immediate: true` to start scanning right away.

### Reading Records

`message` holds the last read NDEF message and `records` is a shortcut for its records. The payload of a record is always a `DataView` and needs to be decoded based on its `recordType`:

```ts
import { useWebNFC } from '@vueuse/core'
import { computed } from 'vue'

const { records } = useWebNFC()

const texts = computed(() =>
  records.value
    .filter(record => record.recordType === 'text')
    .map(record => new TextDecoder(record.encoding ?? 'utf-8').decode(record.data)),
)
```

### Event Hooks

`onReading` is triggered for every tag read, even when the same tag is read multiple times in a row.

```ts
import { useWebNFC } from '@vueuse/core'

const { scan, onReading, onReadingError } = useWebNFC()

onReading(({ serialNumber, message }) => {
  console.log(serialNumber, message.records)
})

onReadingError(() => {
  console.log('Tag could not be read, try another one')
})
```

### Writing

`write()` resolves once the user taps a tag and the message has been written. It accepts a string, a `BufferSource` or a full NDEF message. Existing data on the tag is overwritten by default.

```ts
import { useWebNFC } from '@vueuse/core'

const { write } = useWebNFC()

await write('Hello VueUse')

await write({
  records: [
    { recordType: 'url', data: 'https://vueuse.org' },
    { recordType: 'mime', mediaType: 'application/json', data: JSON.stringify({ id: 42 }) },
  ],
})

// Give up if no tag is tapped within 10 seconds and keep existing data
await write('Hello', { overwrite: false, signal: AbortSignal.timeout(10_000) })
```

### Making a Tag Read-only

> [!WARNING]
> `makeReadOnly()` permanently locks the tag. This cannot be undone.

```ts
import { useWebNFC } from '@vueuse/core'

const { makeReadOnly } = useWebNFC()

try {
  await makeReadOnly()
}
catch {
  // The tag does not support being made read-only
}
```

### Error Handling

All failures are reflected in `error`. Failures of `scan()` (e.g. permission denied) are only reported there, while `write()` and `makeReadOnly()` additionally reject, so they can be handled where they are called.

### Permission

```ts
import { usePermission, useWebNFC } from '@vueuse/core'

const { isSupported, scan } = useWebNFC()
const nfcPermission = usePermission('nfc') // 'granted' | 'denied' | 'prompt'
```
