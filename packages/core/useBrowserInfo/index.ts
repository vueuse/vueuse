import Bowser from 'bowser'
import { ref } from 'vue-demi'
import type { Ref } from 'vue-demi'
import { useNavigatorLanguage } from '../useNavigatorLanguage'
import { defaultDocument } from '../_configurable'

export interface BrowserInfo extends Bowser.Parser.ParsedResult {
  language: Ref<string | undefined>
  isMobile: boolean
}

export function useBrowserInfo() {
  const { language } = useNavigatorLanguage()

  const isMobile = !!(defaultDocument && 'ontouchstart' in defaultDocument.documentElement)

  const ua = navigator.userAgent

  const parsedResult = Bowser.parse(ua)

  const browserInfo = ref<BrowserInfo>({
    language,
    isMobile,
    ...parsedResult,
  })

  return browserInfo
}

export type UseBrowserInfoReturn = ReturnType<typeof useBrowserInfo>
