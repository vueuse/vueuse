import { readonly, ref } from 'vue-demi'

import type { ConfigurableNavigator } from '../_configurable'

import { defaultNavigator } from '../_configurable'

import { parseUserAgent } from './parseUserAgent'

export interface UseUserAgentOptions extends ConfigurableNavigator {}

export const useUserAgent = (options?: UseUserAgentOptions) => {
  const {
    navigator = defaultNavigator,
  } = options || {}

  const userAgent = navigator ? navigator.userAgent : undefined

  const name = ref<null | string>(null)

  const version = ref<null | string>(null)

  const os = ref<null | string>(null)

  if (userAgent) {
    const { name: n, version: v, os: o } = parseUserAgent(userAgent)

    name.value = n

    version.value = v

    os.value = o
  }

  return {
    name: readonly(name),
    version: readonly(version),
    os: readonly(os),
  }
}
