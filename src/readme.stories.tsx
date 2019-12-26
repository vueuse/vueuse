import 'vue-tsx-support/enable-check'
import { storiesOf } from '@storybook/vue'
import { ShowDocs } from './dev/storybook'

// @ts-ignore
const Docs: any = () => <ShowDocs md={require('../README.md')} />

storiesOf('Docs|Home', module)
  .add('Read Me', () => Docs)
