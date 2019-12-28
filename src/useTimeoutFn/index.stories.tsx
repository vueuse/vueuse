import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent, ref } from '../api'
import { ShowDocs } from '../dev/storybook'
import { useTimeoutFn } from '.'

type Inject = {
  ready: boolean
  restart: Function
  text: string
}

const Demo = createComponent({
  setup () {
    const defaultText = 'Please wait 3 seconds'
    const text = ref(defaultText)
    const { ready, start } = useTimeoutFn(() => {
      text.value = 'Fired!'
    }, 3000)

    const restart = () => {
      text.value = defaultText
      start()
    }

    return {
      ready,
      restart,
      text,
    }
  },

  render (this: Vue & Inject) {
    const { ready, restart, text } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>

        <div id='demo'>
          <p>{text}</p>
          <button onClick={() => restart()} disabled={!ready}>Start Again</button>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Animation', module)
  .add('useTimeoutFn', () => Demo as any)
