import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../dev/storybook'
import { useRafFn } from '.'

const Demo = createComponent({
  setup () {
    const elapsed = useRafFn((elapsed) => {
      console.log(elapsed.value)
    })

    return {
      elapsed,
    }
  },

  render (this: Vue & any) {
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

storiesOf('Animation', module)
  .add('useRafFn', () => Demo as any)
