import { isString } from '@vueuse/shared'
import { IpcRenderer } from 'electron'
import { Ref, shallowRef } from 'vue-demi'

export function useIpcRendererInvoke<T>(ipcRenderer: IpcRenderer, channel: string, ...args: any[]): Ref<T | null>

export function useIpcRendererInvoke<T>(channel: string, ...args: any[]): Ref<T | null>

export function useIpcRendererInvoke<T>(...args: any[]): Ref<T | null> {
  let ipcRenderer: IpcRenderer | undefined
  let channel: string
  let invokeArgs: any[]

  if (isString(args[0])) {
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
