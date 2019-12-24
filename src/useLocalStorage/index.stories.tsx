import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useLocalStorage } from '.'

// @ts-ignore
const Docs: any = () => <ShowDocs md={require('./index.md')} />

const Demo = createComponent({
  setup () {
    const { state, update } = useLocalStorage('vue-use-locale-storage', {
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
    return (
      <div>
        <input v-model={state.name} type='text'/>
        <input v-model={state.color} type='text'/>
        <input v-model={state.size} type='text'/>
        <button onClick={() => this.update()} >Save</button>

        <pre lang='json'>{JSON.stringify(state, null, 2)}</pre>
      </div>
    )
  },
})

storiesOf('State|useLocalStorage', module)
  .add('docs', () => Docs)
  .add('demo', () => Demo)
