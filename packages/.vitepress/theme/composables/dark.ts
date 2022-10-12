import { useDark } from '@vueuse/core'

export const isDark = useDark({
  storageKey: 'vitepress-theme-appearance',
})
