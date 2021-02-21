import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import { handleRedirects } from './redirects'

import './styles/vars.css'
import './styles/layout.css'
import './styles/code.css'
import './styles/demo.css'
import './styles/custom-blocks.css'
import './styles/sidebar-links.css'
import './styles/utils.css'

const theme = {
  Layout,
  NotFound,
  enhanceApp({ app, router }) {
    if (typeof window !== 'undefined')
      handleRedirects(router)

    // @ts-ignore
    import('vite-plugin-editor-nav/client').then(i => i.default(router))
  },
}

export default theme
