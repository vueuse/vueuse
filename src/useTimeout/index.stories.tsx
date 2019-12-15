/* eslint import/no-extraneous-dependencies: off */
import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '@vue/composition-api'
import { ShowDocs } from '../utils/stories'
import { useTimeout } from '.'

type Inject = {
  ready: boolean
}

// @ts-ignore
const Docs: any = () => <ShowDocs md={require('./index.md')} />

const Demo = createComponent({
  setup () {
    const [ready] = useTimeout(4000)
    return {
      ready,
    }
  },

  render (this: Vue & Inject) {
    const { ready } = this
    return (
      <div>
        <div>Ready: {ready}</div>
      </div>
    )
  },
})

storiesOf('useTimeout', module)
  .add('docs', () => Docs)
  .add('demo', () => Demo)
