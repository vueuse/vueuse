import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useRafFn } from '.'

const Demo = defineComponent({
  setup() {
    const count = ref(0)
    const { start, stop } = useRafFn(() => {
      count.value += 1
    })

    return {
      count,
      start,
      stop,
    }
  },

  render(this: Vue & any) {
    const { count } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <p>Count: {count}</p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Animation', module)
  .add('useRafFn', () => Demo as any)
