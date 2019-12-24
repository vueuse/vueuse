import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
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
      <div id='demo'>
        <p>Now: {now}</p>
      </div>
    )
  },
})

storiesOf('Animation|useNow', module)
  .add('docs', () => Docs)
  .add('demo', () => Demo as any)
