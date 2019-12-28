import { configure, addParameters } from '@storybook/vue'
import 'github-markdown-css'
import './base16-gruvbox.dark.css'
import './style.css'
import theme from './theme'

addParameters({
  options: {
    theme,
    hierarchySeparator: /\//,
    hierarchyRootSeparator: /\|/,
  },
})

configure(require.context('../src', true, /\.stories\.tsx$/), module)
