import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useRaf } from '.'

type Inject = {
  elapsed: number
}

const Demo = defineComponent({
  setup() {
    const elapsed = useRaf()

    return {
      elapsed,
    }
  },

  render(this: Vue & Inject) {
    const { elapsed } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <p>Elapsed: {elapsed}</p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Animation', module)
  .add('useRaf', () => Demo as any)
