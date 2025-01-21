import type { ComputedRef, Ref } from 'vue'
import type { ConfigurableNavigator } from '../_configurable'
import { createSingletonPromise } from '@vueuse/shared'
import { shallowRef, toRaw } from 'vue'
import { defaultNavigator } from '../_configurable'
import { useEventListener } from '../useEventListener'
import { useSupported } from '../useSupported'

type DescriptorNamePolyfill =
  'accelerometer' |
  'accessibility-events' |
  'ambient-light-sensor' |
  'background-sync' |
  'camera' |
  'clipboard-read' |
  'clipboard-write' |
  'gyroscope' |
  'magnetometer' |
  'microphone' |
  'notifications' |
  'payment-handler' |
  'persistent-storage' |
  'push' |
  'speaker' |
  'local-fonts'

export type GeneralPermissionDescriptor =
  | PermissionDescriptor
  | { name: DescriptorNamePolyfill }

export interface UsePermissionOptions<Controls extends boolean> extends ConfigurableNavigator {
  /**
   * Expose more controls
   *
   * @default false
   */
  controls?: Controls
}

export type UsePermissionReturn = Readonly<Ref<PermissionState | undefined>>
export interface UsePermissionReturnWithControls {
  state: UsePermissionReturn
  isSupported: ComputedRef<boolean>
  query: () => Promise<PermissionStatus | undefined>
}

/**
 * Reactive Permissions API.
 *
 * @see https://vueuse.org/usePermission
 */
export function usePermission(
  permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'],
  options?: UsePermissionOptions<false>
): UsePermissionReturn
export function usePermission(
  permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'],
  options: UsePermissionOptions<true>,
): UsePermissionReturnWithControls
export function usePermission(
  permissionDesc: GeneralPermissionDescriptor | GeneralPermissionDescriptor['name'],
  options: UsePermissionOptions<boolean> = {},
): UsePermissionReturn | UsePermissionReturnWithControls {
  const {
    controls = false,
    navigator = defaultNavigator,
  } = options

  const isSupported = useSupported(() => navigator && 'permissions' in navigator)
  const permissionStatus = shallowRef<PermissionStatus>()

  const desc = typeof permissionDesc === 'string'
    ? { name: permissionDesc } as PermissionDescriptor
    : permissionDesc as PermissionDescriptor
  const state = shallowRef<PermissionState | undefined>()

  const update = () => {
    state.value = permissionStatus.value?.state ?? 'prompt'
  }

  useEventListener(permissionStatus, 'change', update, { passive: true })

  const query = createSingletonPromise(async () => {
    if (!isSupported.value)
      return

    if (!permissionStatus.value) {
      try {
        permissionStatus.value = await navigator!.permissions.query(desc)
      }
      catch {
        permissionStatus.value = undefined
      }
      finally {
        update()
      }
    }

    if (controls)
      return toRaw(permissionStatus.value)
  })

  query()

  if (controls) {
    return {
      state: state as UsePermissionReturn,
      isSupported,
      query,
    }
  }
  else {
    return state as UsePermissionReturn
  }
}
