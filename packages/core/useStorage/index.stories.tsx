import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useStorage } from '.'

const Demo = defineComponent({
  setup() {
    const state = useStorage('vue-use-locale-storage', {
      name: 'Banana',
      color: 'Yellow',
      size: 'Medium',
    })

    return {
      state,
    }
  },

  render(this: Vue & {state: any; update: any}) {
    const { state } = this
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <input v-model={state.name} type='text'/>
          <input v-model={state.color} type='text'/>
          <input v-model={state.size} type='text'/>

          <pre lang='json'>{JSON.stringify(state, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('State', module)
  .add('useStorage', () => Demo as any)
