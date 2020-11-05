import { noop } from '@vueuse/shared'
import { ref } from 'vue-demi'
import { useEventListener } from '../useEventListener'
import { ConfigurableNavigator, defaultNavigator } from '../_configurable'

type DescriptorNamePolyfill = 'clipboard-read' | 'clipboard-write'

export type GeneralPermissionDescriptor =
  | PermissionDescriptor
  | DevicePermissionDescriptor
  | MidiPermissionDescriptor
  | PushPermissionDescriptor
  | { name: DescriptorNamePolyfill }

export function usePermission(
  permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'],
  { navigator = defaultNavigator }: ConfigurableNavigator = {},
) {
  let permissionStatus: PermissionStatus | null = null

  const desc = typeof permissionDesc === 'string'
    ? { name: permissionDesc } as PermissionDescriptor
    : permissionDesc as PermissionDescriptor

  const state = ref<PermissionState | ''>('')

  const onChange = () => {
    if (permissionStatus)
      state.value = permissionStatus.state
  }

  if (navigator && 'permissions' in navigator) {
    navigator.permissions
      .query(desc)
      .then((status) => {
        permissionStatus = status
        onChange()
        useEventListener(permissionStatus, 'change', onChange, undefined)
      })
      .catch(noop)
  }

  return state
}
