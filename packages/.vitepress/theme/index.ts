import DefaultTheme from 'vitepress/theme'
import { handleRedirects } from './redirects'

import './styles/code.css'
import './styles/demo.css'
import './styles/utils.css'
import './styles/vars.css'
import 'uno.css'
import './styles/overrides.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: any) {
    if (typeof window !== 'undefined')
      handleRedirects(ctx.router)
  },
}
