import 'vue-tsx-support/enable-check'
import { storiesOf } from '@storybook/vue'
import { ShowDocs, redirect } from './dev/storybook'

// @ts-ignore
const Docs: any = () => <ShowDocs md={require('../README.md')} />

storiesOf('Docs', module)
  .add('Read Me', () => Docs)
  .add('Github', () => redirect('https://github.com/antfu/vueuse'))
  .add('NPM', () => redirect('https://www.npmjs.com/package/@vueuse/core'))
