import { isString } from '@vueuse/shared'
import { ref, watch, Ref, ComputedRef, isRef } from 'vue-demi'

export function useFavicon(
  newIcon: Ref<string> | ComputedRef<string> | string | null = null,
  options: { baseUrl?: string; rel?: string } = {},
) {
  const {
    baseUrl = '',
    rel = 'icon',
  } = options

  const favicon = isRef(newIcon)
    ? newIcon
    : ref<string | null>(newIcon)

  const applyIcon = (icon: string) => {
    document.head.querySelectorAll<HTMLLinkElement>(`link[rel*="${rel}"]`)
      .forEach((el: HTMLLinkElement) => { el.href = `${baseUrl}${icon}` })
  }

  watch(favicon, (i, o) => {
    if (isString(i) && i !== o) applyIcon(i)
  }, {
    immediate: true,
  })

  return favicon
}
