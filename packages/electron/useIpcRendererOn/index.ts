import { isString, tryOnScopeDispose } from '@vueuse/shared'
import type { IpcRenderer } from 'electron'
import type { IpcRendererListener } from '../_types'

/**
 * Listens to channel, when a new message arrives listener would be called with listener(event, args...).
 * [ipcRenderer.removeListener](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovelistenerchannel-listener) automatically on unmounted.
 *
 * You need to provide `ipcRenderer` to this function.
 *
 * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendereronchannel-listener
 * @see https://vueuse.org/useIpcRendererOn
 */
export function useIpcRendererOn(ipcRenderer: IpcRenderer, channel: string, listener: IpcRendererListener): IpcRenderer

/**
 * Listens to channel, when a new message arrives listener would be called with listener(event, args...).
 * [ipcRenderer.removeListener](https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovelistenerchannel-listener) automatically on unmounted.
 *
 * `ipcRenderer` will be automatically gotten.
 *
 * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendereronchannel-listener
 * @see https://vueuse.org/useIpcRendererOn
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

  tryOnScopeDispose(() => {
    ipcRenderer!.removeListener(channel, listener)
  })

  return ipcRenderer.on(channel, listener)
}
