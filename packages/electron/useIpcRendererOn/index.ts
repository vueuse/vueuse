import { isString, tryOnUnmounted } from '@vueuse/shared'
import { IpcRenderer } from 'electron'
import { IpcRendererListener } from '../_types'

export function useIpcRendererOn(ipcRenderer: IpcRenderer, channel: string, listener: IpcRendererListener): IpcRenderer

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
