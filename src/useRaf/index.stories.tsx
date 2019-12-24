/* eslint import/no-extraneous-dependencies: off */
import 'vue-tsx-support/enable-check'
import { storiesOf } from '@storybook/vue'
import { ShowDocs } from '../utils_dev/storybook'

// @ts-ignore
const Docs: any = () => <ShowDocs md={require('./index.md')} />

storiesOf('Animation|useRaf', module)
  .add('docs', () => Docs)
  // .add('demo', () => Demo)
