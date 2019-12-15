import { configure, addParameters } from '@storybook/vue'
import { themes } from '@storybook/theming'
import 'github-markdown-css'
import 'prismjs/themes/prism-tomorrow.css'
import './style.css'
import { init } from '../src'

addParameters({
  options: {
    theme: themes.dark,
    hierarchySeparator: /\//,
    hierarchyRootSeparator: /\|/,
  },
})

init()

configure(require.context('../src', true, /\.stories\.tsx$/), module)
