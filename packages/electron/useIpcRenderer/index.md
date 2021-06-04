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
/**
 * Result from useIpcRenderer
 *
 * @see https://www.electronjs.org/docs/api/ipc-renderer
 * @export
 * @interface UseIpcRendererReturn
 */
export interface UseIpcRendererReturn {
  /**
   * Listens to channel, when a new message arrives listener would be called with listener(event, args...).
   * [ipcRenderer.removeListener](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovelistenerchannel-listener) automatically on unmounted.
   *
   * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendereronchannel-listener
   * @param {string} channel
   * @param {IpcRendererListener} listener
   * @returns {IpcRenderer}
   */
  on(channel: string, listener: IpcRendererListener): IpcRenderer
  /**
   * Adds a one time listener function for the event. This listener is invoked only the next time a message is sent to channel, after which it is removed.
   *
   * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendereroncechannel-listener
   * @param {string} channel
   * @param {(event: IpcRendererEvent, ...args: any[]) => void} listener
   * @returns {IpcRenderer}
   */
  once(
    channel: string,
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ): IpcRenderer
  /**
   * Removes the specified listener from the listener array for the specified channel.
   *
   * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovelistenerchannel-listener
   * @param {string} channel
   * @param {(...args: any[]) => void} listener
   * @returns {IpcRenderer}
   */
  removeListener(
    channel: string,
    listener: (...args: any[]) => void
  ): IpcRenderer
  /**
   * Removes all listeners, or those of the specified channel.
   *
   * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovealllistenerschannel
   * @param {string} channel
   * @returns {IpcRenderer}
   */
  removeAllListeners(channel: string): IpcRenderer
  /**
   * Send an asynchronous message to the main process via channel, along with arguments.
   *
   * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendchannel-args
   * @param {string} channel
   * @param {...any[]} args
   */
  send(channel: string, ...args: any[]): void
  /**
   * Returns Promise<any> - Resolves with the response from the main process.
   * Send a message to the main process via channel and expect a result ~~asynchronously~~.
   * As composition-api, it makes asynchronous operations look like synchronous.
   *
   * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
   * @template T
   * @param {string} channel
   * @param {...any[]} args
   * @returns {(Ref<T | null>)}
   */
  invoke<T>(channel: string, ...args: any[]): Ref<T | null>
  /**
   * Returns any - The value sent back by the ipcMain handler.
   * Send a message to the main process via channel and expect a result synchronously.
   *
   * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendsyncchannel-args
   * @template T
   * @param {string} channel
   * @param {...any[]} args
   * @returns {(Ref<T | null>)}
   */
  sendSync<T>(channel: string, ...args: any[]): Ref<T | null>
  /**
   * Send a message to the main process, optionally transferring ownership of zero or more MessagePort objects.
   *
   * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererpostmessagechannel-message-transfer
   * @param {string} channel
   * @param {*} message
   * @param {MessagePort[]} [transfer]
   */
  postMessage(channel: string, message: any, transfer?: MessagePort[]): void
  /**
   * Sends a message to a window with webContentsId via channel.
   *
   * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendtowebcontentsid-channel-args
   * @param {number} webContentsId
   * @param {string} channel
   * @param {...any[]} args
   */
  sendTo(webContentsId: number, channel: string, ...args: any[]): void
  /**
   * Like ipcRenderer.send but the event will be sent to the <webview> element in the host page instead of the main process.
   *
   * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendtohostchannel-args
   * @param {string} channel
   * @param {...any[]} args
   */
  sendToHost(channel: string, ...args: any[]): void
}
/**
 * Get the `ipcRenderer` module with all APIs.
 *
 * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendtohostchannel-args
 * @export
 * @param {IpcRenderer} [ipcRenderer]
 * @returns {UseIpcRendererReturn}
 */
export declare function useIpcRenderer(
  ipcRenderer?: IpcRenderer
): UseIpcRendererReturn
```

## Source

[Source](https://github.com/vueuse/vueuse/blob/main/packages/electron/useIpcRenderer/index.ts) • [Docs](https://github.com/vueuse/vueuse/blob/main/packages/electron/useIpcRenderer/index.md)


<!--FOOTER_ENDS-->
