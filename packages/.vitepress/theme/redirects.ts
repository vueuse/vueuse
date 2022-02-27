import type { Router } from 'vitepress'
import { functions } from '../../../packages/metadata/metadata'

export function handleRedirects(router: Router) {
  const query = new URLSearchParams(location.search)

  // redirects for the legacy storybook
  if (query.get('path')?.startsWith('/story/')) {
    const name = query.get('path')?.split('-').slice(-1)[0]?.toLowerCase()
    const fn = functions.find(i => i.name.toLowerCase() === name)
    if (fn)
      router.go(`/${fn.package}/${fn.name}/`)
  }
}
