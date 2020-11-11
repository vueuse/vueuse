import 'vue-tsx-support/enable-check'
import { storiesOf } from '@storybook/vue'

// this is a hack of storybook to make top level stories
const sections = [
  'Docs',
  'Links',
  'Showcases',
  'Component',
  'Watch',
  'State',
  'Sensors',
  'Browser',
  'Animation',
  'Utilities',
  'Misc',
  '@Integrations',
  '@Router',
  '@Firebase',
  '@RxJS',
]

for (const section of sections) {
  storiesOf(`${section}|__empty`, module)
    .add('__empty', () => '')
}
