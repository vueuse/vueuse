import { computed, ref } from 'vue-demi'
import { useRoute } from 'vitepress'
import type { DefaultTheme } from '../config'
import { isExternal as isExternalCheck } from '../utils'
import { useUrl } from '../composables/url'

const counter = ref(0)

export function useNavLink(item: DefaultTheme.NavItemWithLink) {
  const route = useRoute()
  const { withBase } = useUrl()

  const isExternal = isExternalCheck(item.link)

  const props = computed(() => {
    // eslint-disable-next-line no-unused-expressions
    counter.value
    const hash = typeof window !== 'undefined'
      ? location.hash || ''
      : ''
    return {
      class: {
        active: item.exact
          ? normalizePathWithHash(withBase(item.link)) === normalizePathWithHash(route.path + hash)
          : normalizePath(withBase(item.link)) === normalizePath(route.path),
        isExternal,
      },
      href: isExternal ? item.link : withBase(item.link),
      target: item.target || isExternal ? '_blank' : null,
      rel: item.rel || isExternal ? 'noopener noreferrer' : null,
      'aria-label': item.ariaLabel,
    }
  })

  return {
    trigger: () => counter.value += 1,
    props,
    isExternal,
  }
}

function normalizePath(path: string): string {
  path = path
    .replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/\.html$/, '')

  if (path.endsWith('/'))
    path += 'index'

  return path
}

function normalizePathWithHash(path: string): string {
  const hash = path.match(/#.*$/)?.[0] || ''
  path = normalizePath(path) + hash
  return path
}
