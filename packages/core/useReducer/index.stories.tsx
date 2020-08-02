import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { ComplexDemo } from './ComplexDemo'
import { SimpleDemo } from './SimpleDemo'

const Demo = defineComponent({
  render(this: Vue & { state: any; dispatch }) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />
    const ComplexDocs = <ShowDocs md={require('./complex.md')} />

    return (
      <div>
        <SimpleDemo />
        {Docs}
        <ComplexDemo />
        {ComplexDocs}
      </div>
    )
  },
})

storiesOf('State', module).add('useReducer', () => Demo as any)
