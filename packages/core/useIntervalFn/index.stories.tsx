import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useIntervalFn } from '.'

type Inject = {
  count: number
}

const Demo = defineComponent({
  setup() {
    const count = ref(0)

    useIntervalFn(() => {
      count.value++
    }, 1000)

    return {
      count,
    }
  },

  render(this: Vue & Inject) {
    const { count } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <p>Seconds passed: {count}</p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Animation', module)
  .add('useIntervalFn', () => Demo as any)
