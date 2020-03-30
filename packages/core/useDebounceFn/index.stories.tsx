import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useDebounceFn } from '.'

type Inject = {
  clicked: number
  updated: number
  clickedFn: Function
}

const Demo = defineComponent({
  setup() {
    const updated = ref(0)
    const clicked = ref(0)
    const debouncedFn = useDebounceFn(() => {
      updated.value += 1
    }, 1000)

    const clickedFn = () => {
      clicked.value += 1
      debouncedFn()
    }

    return {
      clicked,
      clickedFn,
      updated,
    }
  },

  render(this: Vue & Inject) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
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

storiesOf('Side Effects', module)
  .add('useDebounceFn', () => Demo as any)
