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

/**
 * Reactive Permissions API.
 *
 * @see   {@link https://vueuse.js.org/usePermission}
 * @param permissionDesc
 * @param options
 */
export function usePermission(
  permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'],
  options: ConfigurableNavigator = {},
) {
  const { navigator = defaultNavigator } = options
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
        useEventListener(permissionStatus, 'change', onChange)
        onChange()
      })
      .catch(noop)
  }

  return state
}
