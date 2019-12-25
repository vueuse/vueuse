import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useMouse, MouseState } from '.'

type Inject = {
  state: MouseState
}

const Demo = createComponent({
  setup () {
    const { state } = useMouse()

    return {
      state,
    }
  },

  render (this: Vue & Inject) {
    const { state } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <pre lang='json'>{JSON.stringify(state, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors|useMouse', module)
  .add('Demo & Docs', () => Demo as any)
