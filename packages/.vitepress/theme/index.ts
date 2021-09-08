import { VPTheme } from '@vue/theme'
import { handleRedirects } from './redirects'

import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import './styles/code.css'
import './styles/demo.css'
import './styles/utils.css'
import 'virtual:windi-utilities.css'
import './styles/overrides.css'

const theme = {
  ...VPTheme,
  enhanceApp(ctx) {
    VPTheme.enhanceApp?.(ctx)

    if (typeof window !== 'undefined')
      handleRedirects(ctx.router)
  },
}

export default theme
