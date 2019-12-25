import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useRaf } from '.'

type Inject = {
  elapsed: number
}

const Demo = createComponent({
  setup () {
    const elapsed = useRaf()

    return {
      elapsed,
    }
  },

  render (this: Vue & Inject) {
    const { elapsed } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <p>Elapsed: {elapsed}</p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Animation|useRaf', module)
  .add('Demo & Docs', () => Demo as any)
