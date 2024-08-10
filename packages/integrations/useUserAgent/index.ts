import { toValue } from '@vueuse/shared'
import type { MaybeRefOrGetter } from '@vueuse/shared'
import { UAParser } from 'ua-parser-js'

export function useUserAgent(
  uaString: MaybeRefOrGetter<string>,
) {
  const createUaParser = () => {
    return new UAParser(
      uaString ? toValue(uaString) : undefined,
    )
  }

  const uaParser = createUaParser()

  return {
    ...uaParser,
  }
}

export type UseUserAgentReturn = ReturnType<typeof useUserAgent>
