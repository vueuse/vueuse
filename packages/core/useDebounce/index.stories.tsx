import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref, watch } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useDebounce } from '.'

type Inject = {
  input: string
  debounced: string
  updated: number
}

const Demo = defineComponent({
  setup() {
    const input = ref('')
    const debounced = useDebounce(input, 1000)
    const updated = ref(0)

    watch(debounced, () => {
      updated.value += 1
    }, { lazy: true })

    return {
      input,
      debounced,
      updated,
    }
  },

  render(this: Vue & Inject) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <input v-model={this.input} placeholder='Try to type anything...'/>
          <note>Delay is set to 1000ms for this demo.</note>

          <p>Debounced: {this.debounced}</p>
          <p>Times Updated: {this.updated}</p>

        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Side Effects', module)
  .add('useDebounce', () => Demo as any)
