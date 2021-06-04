import { isString, tryOnUnmounted } from '@vueuse/shared'
import { IpcRenderer } from 'electron'
import { IpcRendererListener } from '../_types'

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
export function useIpcRendererOn(ipcRenderer: IpcRenderer, channel: string, listener: IpcRendererListener): IpcRenderer

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
export function useIpcRendererOn(channel: string, listener: IpcRendererListener): IpcRenderer

export function useIpcRendererOn(...args: any[]): IpcRenderer {
  let ipcRenderer: IpcRenderer | undefined
  let channel: string
  let listener: IpcRendererListener

  if (isString(args[0])) {
    [channel, listener] = args
    ipcRenderer = window.require ? window.require('electron').ipcRenderer : undefined
  }
  else {
    [ipcRenderer, channel, listener] = args
  }

  if (!ipcRenderer)
    throw new Error('please provide IpcRenderer module or enable nodeIntegration')

  tryOnUnmounted(() => {
    ipcRenderer!.removeListener(channel, listener)
  })

  return ipcRenderer.on(channel, listener)
}
