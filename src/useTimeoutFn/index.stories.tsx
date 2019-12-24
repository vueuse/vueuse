import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useTimeoutFn } from '.'

type Inject = {
  ready: boolean
  start: Function
}

// @ts-ignore
const Docs: any = () => <ShowDocs md={require('./index.md')} />

const Demo = createComponent({
  setup () {
    const { ready, start } = useTimeoutFn(() => {
      // eslint-disable-next-line no-alert
      alert('Hello')
    }, 3000)

    return {
      ready,
      start,
    }
  },

  render (this: Vue & Inject) {
    const { ready, start } = this

    // @ts-ignore
    const doc = <ShowDocs md={require('./index.md')} />

    return (
      <div id='demo'>
        <p>Please wait 3 seconds</p>
        <p>Ready: {ready.toString()}</p>
        <br></br>
        <button onClick={() => start()} disabled={!ready}>Start Again</button>

        {doc}
      </div>
    )
  },
})

storiesOf('Animation|useTimeoutFn', module)
  .add('docs', () => Docs)
  .add('demo', () => Demo as any)
