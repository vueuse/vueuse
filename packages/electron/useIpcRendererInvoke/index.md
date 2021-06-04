---
category: '@Electron'
---

# useIpcRendererInvoke

Reactive [ipcRenderer.invoke API](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args) result. Make asynchronous operations look like synchronous.

## Usage

```ts
import { useIpcRendererInvoke } from '@vueuse/electron'

// enable nodeIntegration if you don't provide ipcRenderer explicitly 
// @see: https://www.electronjs.org/docs/api/webview-tag#nodeintegration
// Ref result will return
const result = useIpcRendererInvoke<string>('custom-channel', 'some data')
const msg = computed(() => result.value?.msg)

```


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
export declare function useIpcRendererInvoke<T>(
  ipcRenderer: IpcRenderer,
  channel: string,
  ...args: any[]
): Ref<T | null>
export declare function useIpcRendererInvoke<T>(
  channel: string,
  ...args: any[]
): Ref<T | null>
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/electron/useIpcRendererInvoke/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/electron/useIpcRendererInvoke/index.md)


<!--FOOTER_ENDS-->
