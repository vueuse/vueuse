import { storiesOf } from '@storybook/vue'
import { categories } from './_docs/categories'

// this is a hack of storybook to make top level stories
const sections = [
  'Docs',
  'Links',
  ...categories,
]

for (const section of sections) {
  storiesOf(`${section}|__empty`, module)
    .add('__empty', () => '')
}
