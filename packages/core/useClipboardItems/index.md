---
category: Browser
related:
  - useClipboard
---

# useClipboardItems

Reactive [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API). Provides the ability to respond to clipboard commands (cut, copy, and paste) as well as to asynchronously read from and write to the system clipboard. Access to the contents of the clipboard is gated behind the [Permissions API](https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API). Without user permission, reading or altering the clipboard contents is not permitted.

## Difference from `useClipboard`

`useClipboard` is a "text-only" function, while `useClipboardItems` is a [ClipboardItem](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem) based function. You can use `useClipboardItems` to copy any content supported by [ClipboardItem](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem).

## Usage

```js
import { useClipboardItems } from '@vueuse/core'

const mime = 'text/html'
const source = ref([
  new ClipboardItem({
    [mime]: new Blob(['<b>HTML content</b>'], { type: mime }),
  })
])

const { content, copy, copied, isSupported } = useClipboardItems({ source })
```

```vue
<template>
  <div v-if="isSupported">
    <button @click="copy(source)">
      <!-- by default, `copied` will be reset in 1.5s -->
      <span v-if="!copied">Copy</span>
      <span v-else>Copied!</span>
    </button>
    <p>
      Current copied: <code>{{ content || 'none' }}</code>
    </p>
  </div>
  <p v-else>
    Your browser does not support Clipboard API
  </p>
</template>
```
