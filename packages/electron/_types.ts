import type { IpcRendererEvent } from 'electron'

export type IpcRendererListener = (event: IpcRendererEvent, ...args: any[]) => void
