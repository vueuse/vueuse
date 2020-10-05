import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useThrottleFn } from '.'

type Inject = {
  clicked: number
  updated: number
  clickedFn: Function
  throttledFn: Function
}

const Demo = defineComponent({
  setup() {
    const updated = ref(0)
    const clicked = ref(0)
    const throttledFn = useThrottleFn(() => {
      updated.value += 1
    }, 1000)

    const clickedFn = () => {
      clicked.value += 1
      throttledFn()
    }

    return {
      clicked,
      clickedFn,
      throttledFn,
      updated,
    }
  },

  render(this: Vue & Inject) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <button onClick={() => this.clickedFn()}>Smash me!</button>
          <note>Delay is set to 1000ms for this demo.</note>

          <p>Button clicked: {this.clicked}</p>
          <p>Event handler called: {this.updated}</p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Utilities', module)
  .add('useThrottleFn', () => Demo as any)
