import './styles/vars.css'
import './styles/layout.css'
import './styles/code.css'
import './styles/demo.css'
import './styles/custom-blocks.css'
import './styles/sidebar-links.css'
import './styles/prism-nord.css'

import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import DemoContainer from './components/DemoContainer.vue'

const theme: Theme = {
  Layout,
  NotFound,
  enhanceApp({ app }) {
    app.component('DemoContainer', DemoContainer)
  },
}

export default theme
