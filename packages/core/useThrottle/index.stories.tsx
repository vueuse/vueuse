import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref, watch } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useThrottle } from '.'

type Inject = {
  input: string
  throttled: string
  updated: number
}

const Demo = defineComponent({
  setup() {
    const input = ref('')
    const throttled = useThrottle(input, 1000)
    const updated = ref(0)

    watch(throttled, () => {
      updated.value += 1
    })

    return {
      input,
      throttled,
      updated,
    }
  },

  render(this: Vue & Inject) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <input v-model={this.input} placeholder="Try to type anything..."/>
          <note>Delay is set to 1000ms for this demo.</note>

          <p>Throttled: {this.throttled}</p>
          <p>Times Updated: {this.updated}</p>

        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Side Effects', module)
  .add('useThrottle', () => Demo as any)
