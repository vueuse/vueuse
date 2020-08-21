import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useCounter } from '.'

type Inject = {
  count: number
  inc: Function
  dec: Function
  set: Function
  reset: Function
}

const Demo = defineComponent({
  setup() {
    const { count, inc, dec, set, reset } = useCounter()
    return {
      count,
      inc,
      dec,
      set,
      reset,
    }
  },

  render(this: Vue & Inject) {
    const { count, inc, dec, set, reset } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <p>Count: {count}</p>
          <button onClick={() => inc()}>Increment</button>
          <button onClick={() => dec()}>Decrement</button>
          <button onClick={() => inc(5)}>Increment (+5)</button>
          <button onClick={() => dec(5)}>Decrement (-5)</button>
          <button onClick={() => set(100)}>Set (100)</button>
          <button onClick={() => reset()}>Reset</button>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('State', module)
  .add('useCounter', () => Demo as any)
