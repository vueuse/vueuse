import 'vue-tsx-support/enable-check'
import { storiesOf } from '@storybook/vue'
import { ShowDocs, redirect } from './showdocs'

// @ts-ignore
const README: any = () => <ShowDocs md={require('../../README.md')} />
const CONTRIBUTING: any = () => <ShowDocs md={require('../../CONTRIBUTING.md')} />

storiesOf('Docs', module)
  .add('README', () => README)
  .add('Contribute', () => CONTRIBUTING)
  .add('Github', () => redirect('https://github.com/antfu/vueuse'))
  .add('NPM', () => redirect('https://www.npmjs.com/package/@vueuse/core'))
