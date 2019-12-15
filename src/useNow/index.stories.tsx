/* eslint import/no-extraneous-dependencies: off */
import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '@vue/composition-api'
import { ShowDocs } from '../utils/stories'
import { useNow } from '.'

type Inject = {
  now: number
}

// @ts-ignore
const Docs: any = () => <ShowDocs md={require('./index.md')} />

const Demo = createComponent({
  setup () {
    const now = useNow()
    return {
      now,
    }
  },

  render (this: Vue & Inject) {
    const { now } = this
    return (
      <div>
        <div>Now: {now}</div>
      </div>
    )
  },
})

storiesOf('useNow', module)
  .add('docs', () => Docs)
  .add('demo', () => Demo)
