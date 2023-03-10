import DefaultTheme from 'vitepress/theme'
import { handleRedirects } from './redirects'

import './styles/main.css'
import './styles/demo.css'
import './styles/utils.css'
import './styles/vars.css'
import 'uno.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: any) {
    if (typeof window !== 'undefined')
      handleRedirects(ctx.router)
  },
}

// Vue School banner, skip on SSG or in an iframe
if (typeof window !== 'undefined' && window.self === window.top) {
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://vueschool.io/banner.js?affiliate=vueuse&type=bottom'
  document.head.appendChild(script)
}
