import 'vue-tsx-support/enable-check'
import { storiesOf } from '@storybook/vue'
import { ShowDocs, redirect } from './showdocs'

const README: any = () => <ShowDocs md={require('../../README.md')} />
const CONTRIBUTING: any = () => <ShowDocs md={require('../../CONTRIBUTING.md')} />
const Guide: any = () => <ShowDocs md={require('../../docs/Guide.md')} />
const Install: any = () => <ShowDocs md={require('../../docs/Install.md')} />

storiesOf('Docs', module)
  .add('Read Me', () => README)
  .add('Installation', () => Install)
  .add('Guide', () => Guide)
  .add('Contributing', () => CONTRIBUTING)

storiesOf('Links', module)
  .add('Github', () => redirect('https://github.com/antfu/vueuse'))
  .add('NPM', () => redirect('https://www.npmjs.com/package/@vueuse/core'))
