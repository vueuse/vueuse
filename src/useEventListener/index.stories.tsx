import 'vue-tsx-support/enable-check'
import { storiesOf } from '@storybook/vue'
import { ShowDocs } from '../dev/storybook'

// @ts-ignore
const Docs: any = <ShowDocs md={require('./index.md')} />

storiesOf('Browser', module)
  .add('useEventListener', () => Docs as any)
