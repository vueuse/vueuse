import { storiesOf } from '@storybook/vue'
import { categories } from './categories'

for (const category of categories) {
  storiesOf(category, module)
    .add('__empty', () => '')
}
