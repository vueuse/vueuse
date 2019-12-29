import { onUnmounted, onMounted, ref } from '../api'
import { off, on } from '../utils'

export type GeneralPermissionDescriptor =
  | PermissionDescriptor
  | DevicePermissionDescriptor
  | MidiPermissionDescriptor
  | PushPermissionDescriptor

type State = PermissionState | ''

const noop = () => {}

export function usePermission (permissionDesc: GeneralPermissionDescriptor | PermissionDescriptor['name']) {
  let mounted = true
  let permissionStatus: PermissionStatus | null = null

  const desc = typeof permissionDesc === 'string'
    ? { name: permissionDesc } as PermissionDescriptor
    : permissionDesc

  const state = ref<State>('')

  const onChange = () => {
    if (mounted && permissionStatus)
      state.value = permissionStatus.state
  }

  const changeState = () => {
    onChange()
    on(permissionStatus, 'change', onChange)
  }

  onMounted(() => {
    if ('permissions' in navigator) {
      navigator.permissions
        .query(desc)
        .then((status) => {
          permissionStatus = status
          changeState()
        })
        .catch(noop)
    }
  })

  onUnmounted(() => {
    mounted = false
    permissionStatus && off(permissionStatus, 'change', onChange)
  })

  return state
}
