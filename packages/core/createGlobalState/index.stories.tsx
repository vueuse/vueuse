import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useStorage } from '../useStorage'
import { createGlobalState } from '.'

const useState = createGlobalState(() => {
  return useStorage('vue-use-locale-storage', {
    name: 'Banana',
    color: 'Yellow',
    size: 'Medium',
  })
})

const Demo = defineComponent({
  setup() {
    const state = useState()

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
        <div id="demo">
          <input v-model={state.name} type="text"/>
          <input v-model={state.color} type="text"/>
          <input v-model={state.size} type="text"/>

          <pre lang="json">{JSON.stringify(state, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('State', module)
  .add('createGlobalState', () => Demo as any)
