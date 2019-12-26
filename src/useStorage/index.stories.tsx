import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useStorage } from '.'

const Demo = createComponent({
  setup () {
    const { state, update } = useStorage('vue-use-locale-storage', {
      name: 'Banana',
      color: 'Yellow',
      size: 'Medium',
    })

    return {
      state,
      update,
    }
  },

  render (this: Vue & {state: any; update: any}) {
    const { state } = this
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <input v-model={state.name} type='text'/>
          <input v-model={state.color} type='text'/>
          <input v-model={state.size} type='text'/>
          <button onClick={() => this.update()} >Save</button>

          <pre lang='json'>{JSON.stringify(state, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('State|useStorage', module)
  .add('Demo & Docs', () => Demo as any)
