/* eslint import/no-extraneous-dependencies: off */
import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent, ref } from '../api'
import { ShowDocs } from '../utils_dev/storybook'
import { useIntervalFn } from '.'

type Inject = {
  count: number
}

// @ts-ignore
const Docs: any = () => <ShowDocs md={require('./index.md')} />

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
    return (
      <div>
        <div>Seconds passed: {count}</div>
      </div>
    )
  },
})

storiesOf('Animation|useIntervalFn', module)
  .add('docs', () => Docs)
  .add('demo', () => Demo)
