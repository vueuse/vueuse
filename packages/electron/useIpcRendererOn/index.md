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


<!--FOOTER_STARTS-->
## Type Declarations

```typescript
/**
 * Listens to channel, when a new message arrives listener would be called with listener(event, args...).
 * [ipcRenderer.removeListener](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovelistenerchannel-listener) automatically on unmounted.
 *
 * You need to provide `ipcRenderer` to this function.
 *
 * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendereronchannel-listener
 * @export
 * @param {IpcRenderer} ipcRenderer
 * @param {string} channel
 * @param {IpcRendererListener} listener
 * @returns {IpcRenderer}
 */
export declare function useIpcRendererOn(
  ipcRenderer: IpcRenderer,
  channel: string,
  listener: IpcRendererListener
): IpcRenderer
/**
 * Listens to channel, when a new message arrives listener would be called with listener(event, args...).
 * [ipcRenderer.removeListener](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovelistenerchannel-listener) automatically on unmounted.
 *
 * `ipcRenderer` will be automatically gotten.
 *
 * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendereronchannel-listener
 * @export
 * @param {string} channel
 * @param {IpcRendererListener} listener
 * @returns {IpcRenderer}
 */
export declare function useIpcRendererOn(
  channel: string,
  listener: IpcRendererListener
): IpcRenderer
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/electron/useIpcRendererOn/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/electron/useIpcRendererOn/index.md)


<!--FOOTER_ENDS-->
