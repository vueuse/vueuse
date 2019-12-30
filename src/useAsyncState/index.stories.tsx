import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import axios from 'axios'
import YAML from 'js-yaml'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../dev/storybook'
import { useAsyncState } from '.'

type Inject = {
  state: object
  ready: boolean
}

const Demo = createComponent({
  setup () {
    const { state, ready } = useAsyncState(
      axios
        .get('https://jsonplaceholder.typicode.com/todos/1')
        .then(t => t.data),
      {},
      2000,
    )

    return { state, ready }
  },

  render (this: Vue & Inject) {
    const { state, ready } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')}/>

    return (
      <div>
        <div id='demo'>
          <p>Ready: {ready.toString()}</p>
          <pre lang='json'>{YAML.safeDump(state)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('State', module)
  .add('useAsyncState', () => Demo as any)
