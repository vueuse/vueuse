---
category: '@Electron'
---

# useIpcRendererOn

Use [ipcRenderer.on](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendereronchannel-listener) with ease and [ipcRenderer.removeListener](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovelistenerchannel-listener) automatically on unmounted.

## Usage

```ts
import { useIpcRendererOn } from '@vueuse/electron'

// enable nodeIntegration if you don't provide ipcRenderer explicitly
// @see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
// remove listener automatically on unmounted
useIpcRendererOn('custom-event', (event, ...args) => {
  console.log(args)
})
```
