---
category: '@Electron'
---

# useIpcRenderer

Provides [ipcRenderer](https://www.electronjs.org/docs/api/ipc-renderer) and it's all APIs.

## Usage

```ts
import { useIpcRenderer } from '@vueuse/electron'

// enable nodeIntegration if you don't provide ipcRenderer explicitly 
// @see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
const ipcRenderer = useIpcRenderer()

// Ref result will return
const result = ipcRenderer.invoke<string>('custom-channel', 'some data')
const msg = computed(() => result.value?.msg)

// remove listener automatically on unmounted
ipcRenderer.on('custom-event', (event, ...args) => {
    console.log(args)
})

```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export interface UseIpcRendererReturn {
  on(channel: string, listener: IpcRendererListener): IpcRenderer
  once(
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ): IpcRenderer
  removeListener(
    channel: string,
    listener: (...args: any[]) => void
  ): IpcRenderer
  removeAllListeners(channel: string): IpcRenderer
  send(channel: string, ...args: any[]): void
  invoke<T>(channel: string, ...args: any[]): Ref<T | null>
  sendSync(channel: string, ...args: any[]): any
  postMessage(channel: string, message: any, transfer?: MessagePort[]): void
  sendTo(webContentsId: number, channel: string, ...args: any[]): void
  sendToHost(channel: string, ...args: any[]): void
}
export declare function useIpcRenderer(
  ipcRenderer?: IpcRenderer
): UseIpcRendererReturn
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/electron/useIpcRenderer/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/electron/useIpcRenderer/index.md)


<!--FOOTER_ENDS-->
