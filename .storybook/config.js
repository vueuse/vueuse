import { configure, addParameters } from '@storybook/vue'
import 'github-markdown-css'
import './base16-gruvbox.dark.css'
import './style.css'
import { init } from '../packages/api'
import theme from './theme'

addParameters({
  options: {
    theme,
    hierarchySeparator: /\//,
    hierarchyRootSeparator: /\|/,
  },
})

init()

configure(require.context('../packages', true, /\.stories\.tsx$/), module)
