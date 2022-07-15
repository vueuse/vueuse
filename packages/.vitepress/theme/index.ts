import { VPTheme } from '@vue/theme'
import { handleRedirects } from './redirects'
import { setupGlobDirectives } from './directives'

import './styles/code.css'
import './styles/demo.css'
import './styles/utils.css'
import 'uno.css'
import './styles/overrides.css'

const theme: any = {
  ...VPTheme,
  enhanceApp(ctx: any) {
    VPTheme.enhanceApp?.(ctx)

    if (typeof window !== 'undefined') {
      handleRedirects(ctx.router)
      setupGlobDirectives(ctx.app)
    }
  },
}

export default theme
