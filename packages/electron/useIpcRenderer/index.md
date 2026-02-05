---
category: '@Electron'
---

# useIpcRenderer

Provides [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer) and all of its APIs with Vue reactivity.

## Usage

```ts
import { useIpcRenderer } from '@vueuse/electron'
import { computed } from 'vue'

// enable nodeIntegration if you don't provide ipcRenderer explicitly
// see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
const ipcRenderer = useIpcRenderer()

// Ref result will return
const result = ipcRenderer.invoke<string>('custom-channel', 'some data')
const msg = computed(() => result.value?.msg)

// remove listener automatically on unmounted
ipcRenderer.on('custom-event', (event, ...args) => {
  console.log(args)
})
```

### Available Methods

| Method                                     | Description                                          |
| ------------------------------------------ | ---------------------------------------------------- |
| `on(channel, listener)`                    | Listen to channel. Auto-removes listener on unmount. |
| `once(channel, listener)`                  | Listen to channel once                               |
| `removeListener(channel, listener)`        | Remove specific listener                             |
| `removeAllListeners(channel)`              | Remove all listeners for channel                     |
| `send(channel, ...args)`                   | Send async message to main process                   |
| `invoke(channel, ...args)`                 | Send message and get response as `ShallowRef`        |
| `sendSync(channel, ...args)`               | Send sync message and get response as `ShallowRef`   |
| `postMessage(channel, message, transfer?)` | Send message with transferable objects               |
| `sendTo(webContentsId, channel, ...args)`  | Send to specific webContents                         |
| `sendToHost(channel, ...args)`             | Send to webview host                                 |

### With Custom IpcRenderer

If `nodeIntegration` is disabled, you can pass the `ipcRenderer` instance explicitly:

```ts
import { useIpcRenderer } from '@vueuse/electron'
import { ipcRenderer } from 'electron'

const ipc = useIpcRenderer(ipcRenderer)
```
