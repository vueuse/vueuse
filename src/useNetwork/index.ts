import { reactive, onUnmounted, toRefs } from '../api'
import { off, on } from '../utils'
import { Refs } from '../types'

export interface NetworkState {
  online: boolean | null
  since: Date | null
  downlink: number | null
  downlinkMax: number | null
  effectiveType: string | null
  rtt: number | null
  type: string | null
}

const getConnection = () => {
  if (typeof navigator !== 'object')
    return null

  const nav = navigator as any
  return nav.connection || nav.mozConnection || nav.webkitConnection
}

const getConnectionState = (): Partial<NetworkState> => {
  const connection = getConnection()
  if (!connection)
    return {}

  const { downlink, downlinkMax, effectiveType, type, rtt } = connection
  return {
    downlink,
    downlinkMax,
    effectiveType,
    type,
    rtt,
  }
}

const defaultState: NetworkState = {
  online: null,
  since: null,
  downlink: null,
  downlinkMax: null,
  effectiveType: null,
  rtt: null,
  type: null,
}

export function useNetwork (initialState: Partial<NetworkState> = {}) {
  const state = reactive(Object.assign(initialState, defaultState)) as NetworkState

  const updateState = (patch: any) => {
    for (const key of Object.keys(patch))
      state[key as keyof NetworkState] = patch[key]
  }
  const connection = getConnection()

  const onOnline = () => {
    updateState({
      online: true,
      since: new Date(),
    })
  }
  const onOffline = () => {
    updateState({
      online: false,
      since: new Date(),
    })
  }
  const onConnectionChange = () => {
    updateState(getConnectionState())
  }

  on(window, 'online', onOnline)
  on(window, 'offline', onOffline)
  if (connection) {
    on(connection, 'change', onConnectionChange)
    updateState({
      online: navigator.onLine,
      since: undefined,
      ...getConnectionState(),
    })
  }

  onUnmounted(() => {
    off(window, 'online', onOnline)
    off(window, 'offline', onOffline)
    if (connection)
      off(connection, 'change', onConnectionChange)
  })

  return toRefs(state as any) as Refs<NetworkState>
}
