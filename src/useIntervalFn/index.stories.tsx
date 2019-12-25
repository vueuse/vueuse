import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent, ref } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useIntervalFn } from '.'

type Inject = {
  count: number
}

const Demo = createComponent({
  setup () {
    const count = ref(0)

    useIntervalFn(() => {
      count.value++
    }, 1000)

    return {
      count,
    }
  },

  render (this: Vue & Inject) {
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

storiesOf('Animation|useIntervalFn', module)
  .add('Demo & Docs', () => Demo as any)
