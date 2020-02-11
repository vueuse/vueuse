import VueI18n from 'vue-i18n'
import { createI18n } from '../createI18n'

export function useI18n(options?: VueI18n.I18nOptions) {
  return createI18n(options)()
}
