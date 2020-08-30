import { configure, addParameters } from '@storybook/vue'
import './style.css'
import theme from './theme'

addParameters({
  options: {
    theme,
    hierarchySeparator: /\//,
    hierarchyRootSeparator: /\|/,
  },
})

configure(require.context('../packages', true, /\.stories\.tsx$/), module)
