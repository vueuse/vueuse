import { ref } from '../../api'
import { useEventListener } from '../useEventListener'

type DescriptorNamePolyfill = 'clipboard-read' | 'clipboard-write'

export type GeneralPermissionDescriptor =
  | PermissionDescriptor
  | DevicePermissionDescriptor
  | MidiPermissionDescriptor
  | PushPermissionDescriptor
  | { name: DescriptorNamePolyfill }

const noop = () => {}

export function usePermission(permissionDesc: GeneralPermissionDescriptor | PermissionDescriptor['name'] | DescriptorNamePolyfill) {
  let permissionStatus: PermissionStatus | null = null

  const desc = typeof permissionDesc === 'string'
    ? { name: permissionDesc } as PermissionDescriptor
    : permissionDesc as PermissionDescriptor

  const state = ref<PermissionState | ''>('')

  const onChange = () => {
    if (permissionStatus)
      state.value = permissionStatus.state
  }

  if ('permissions' in navigator) {
    navigator.permissions
      .query(desc)
      .then((status) => {
        permissionStatus = status
        onChange()
        useEventListener('change', onChange, undefined, permissionStatus)
      })
      .catch(noop)
  }

  return state
}
