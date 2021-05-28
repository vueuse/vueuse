import { IpcRenderer, IpcRendererEvent } from 'electron'
import { Ref, shallowRef } from 'vue-demi'
import { IpcRendererListener } from '../_types'
import { useIpcRendererInvoke } from '../useIpcRendererInvoke'
import { useIpcRendererOn } from '../useIpcRendererOn'

export interface UseIpcRendererReturn {
  on(channel: string, listener: IpcRendererListener): IpcRenderer
  once(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): IpcRenderer
  removeListener(channel: string, listener: (...args: any[]) => void): IpcRenderer
  removeAllListeners(channel: string): IpcRenderer
  send(channel: string, ...args: any[]): void
  invoke<T>(channel: string, ...args: any[]): Ref<T | null>
  sendSync(channel: string, ...args: any[]): any
  postMessage(channel: string, message: any, transfer?: MessagePort[]): void
  sendTo(webContentsId: number, channel: string, ...args: any[]): void
  sendToHost(channel: string, ...args: any[]): void
}

function setSendSync(ipcRenderer: IpcRenderer) {
  return <T>(channel: string, ...args: any[]) => {
    const result = shallowRef<T | null>(null)
    result.value = ipcRenderer.sendSync(channel, ...args)
    return result
  }
}

export function useIpcRenderer(ipcRenderer?: IpcRenderer): UseIpcRendererReturn {
  if (!ipcRenderer)
    ipcRenderer = window?.require('electron').ipcRenderer

  if (!ipcRenderer)
    throw new Error('provide IpcRenderer module or enable nodeIntegration')

  return {
    on: (channel: string, listener: IpcRendererListener) => useIpcRendererOn(channel, listener),
    once: ipcRenderer.once.bind(ipcRenderer),
    removeListener: ipcRenderer.removeListener.bind(ipcRenderer),
    removeAllListeners: ipcRenderer.removeAllListeners.bind(ipcRenderer),
    send: ipcRenderer.send,
    invoke: <T>(channel: string, ...args: any[]) => useIpcRendererInvoke<T>(ipcRenderer!, channel, ...args),
    sendSync: setSendSync(ipcRenderer),
    postMessage: ipcRenderer.postMessage,
    sendTo: ipcRenderer.sendTo,
    sendToHost: ipcRenderer.sendToHost,
  }
}
