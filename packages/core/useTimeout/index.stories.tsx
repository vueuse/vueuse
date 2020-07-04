import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useTimeout } from '.'

type Inject = {
  ready: boolean
  start: Function
}

const Demo = defineComponent({
  setup() {
    const { ready, start } = useTimeout(1000)

    return {
      ready,
      start,
    }
  },

  render(this: Vue & Inject) {
    const { ready, start } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <p>Ready: {ready.toString()}</p>
          <button onClick={() => start()} disabled={!ready}>Start Again</button>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Animation', module)
  .add('useTimeout', () => Demo as any)
