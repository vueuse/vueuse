import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useInterval } from '.'

type Inject = {
  counter: number
}

const Demo = createComponent({
  setup() {
    const { counter } = useInterval(200)

    return {
      counter,
    }
  },

  render(this: Vue & Inject) {
    const { counter } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <p>Interval fired: {counter}</p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Animation', module)
  .add('useInterval', () => Demo as any)
