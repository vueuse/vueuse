import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useSubscription } from '../useSubscription'
import { interval } from 'rxjs'

const Demo = defineComponent({
  setup() {
    const count = ref(0)
    useSubscription(interval(1000).subscribe(() => {
      count.value++
      console.log(count)
    }))
    return {
      count,
    }
  },

  render(this: Vue & {count: any; update: any}) {
    const { count } = this
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          {count}
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Add-ons|Rxjs', module)
  .add('useSubscription', () => Demo as any)
