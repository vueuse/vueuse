import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useThrottleFn } from '.'

type Inject = {
  throttledFn: Function
  updated: number
}

const Demo = defineComponent({
  setup() {
    const updated = ref(0)
    const throttledFn = useThrottleFn(() => {
      updated.value += 1
    }, 1000)

    return {
      throttledFn,
      updated,
    }
  },

  render(this: Vue & Inject) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <button onClick={() => this.throttledFn()}>Smash me!</button>
          <note>Delay is set to 1000ms for this demo.</note>

          <p>Times Updated: {this.updated}</p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Side Effects', module)
  .add('useThrottleFn', () => Demo as any)
