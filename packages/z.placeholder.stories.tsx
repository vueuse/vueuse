import 'vue-tsx-support/enable-check'
import { storiesOf } from '@storybook/vue'

const sections = [
  'Docs',
  'Showcases',
  'State',
  'Sensors',
  'Browser',
  'Misc',
  'Animation',
  'Utilities',
  '@Integrations',
  '@Firebase',
  '@i18n',
  '@RxJS',
]

for (const section of sections) {
  storiesOf(`${section}|__empty`, module)
    .add('__empty', () => '')
}
