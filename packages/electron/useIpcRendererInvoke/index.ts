import type { IpcRenderer } from 'electron'
import type { ShallowRef } from 'vue'
import { shallowRef } from 'vue'

/**
 * Returns Promise<any> - Resolves with the response from the main process.
 *
 * Send a message to the main process via channel and expect a result ~~asynchronously~~. As composition-api, it makes asynchronous operations look like synchronous.
 *
 * You need to provide `ipcRenderer` to this function.
 *
 * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
 * @see https://vueuse.org/useIpcRendererInvoke
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useIpcRendererInvoke<T>(ipcRenderer: IpcRenderer, channel: string, ...args: any[]): ShallowRef<T | null>

/**
 * Returns Promise<any> - Resolves with the response from the main process.
 *
 * Send a message to the main process via channel and expect a result ~~asynchronously~~. As composition-api, it makes asynchronous operations look like synchronous.
 *
 * `ipcRenderer` will be automatically gotten.
 *
 * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
 * @see https://vueuse.org/useIpcRendererInvoke
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useIpcRendererInvoke<T>(channel: string, ...args: any[]): ShallowRef<T | null>

/**
 * Returns Promise<any> - Resolves with the response from the main process.
 *
 * Send a message to the main process via channel and expect a result ~~asynchronously~~. As composition-api, it makes asynchronous operations look like synchronous.
 *
 * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
 * @see https://vueuse.org/useIpcRendererInvoke
 *
 * @__NO_SIDE_EFFECTS__
 */
export function useIpcRendererInvoke<T>(...args: any[]): ShallowRef<T | null> {
  let ipcRenderer: IpcRenderer | undefined
  let channel: string
  let invokeArgs: any[]

  if (typeof args[0] === 'string') {
    [channel, ...invokeArgs] = args
    ipcRenderer = window.require ? window.require('electron').ipcRenderer : undefined
  }
  else {
    [ipcRenderer, channel, ...invokeArgs] = args
  }

  if (!ipcRenderer)
    throw new Error('please provide IpcRenderer module or enable nodeIntegration')

  const result = shallowRef<T | null>(null)

  ipcRenderer.invoke(channel, ...invokeArgs).then((response) => {
    result.value = response
  })

  return result
}
