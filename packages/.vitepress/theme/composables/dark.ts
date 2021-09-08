import { useDark } from '@vueuse/core'

export const isDark = useDark({
  storageKey: 'vue-theme-appearance',
})
