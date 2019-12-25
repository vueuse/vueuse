import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useTimeout } from '.'

type Inject = {
  ready: boolean
  start: Function
}

const Demo = createComponent({
  setup () {
    const { ready, start } = useTimeout(1000)

    return {
      ready,
      start,
    }
  },

  render (this: Vue & Inject) {
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

storiesOf('Animation|useTimeout', module)
  .add('Demo & Docs', () => Demo as any)
