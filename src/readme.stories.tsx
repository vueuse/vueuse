import 'vue-tsx-support/enable-check'
import { storiesOf } from '@storybook/vue'
import { ShowDocs, redirect } from './dev/storybook'

// @ts-ignore
const README: any = () => <ShowDocs md={require('../README.md')} />
const Contributing: any = () => <ShowDocs md={require('../docs/Contributing.md')} />

storiesOf('Docs', module)
  .add('Read Me', () => README)
  .add('Contributing', () => Contributing)
  .add('Github', () => redirect('https://github.com/antfu/vueuse'))
  .add('NPM', () => redirect('https://www.npmjs.com/package/@vueuse/core'))
