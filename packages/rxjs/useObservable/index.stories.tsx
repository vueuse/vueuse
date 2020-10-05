import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useObservable } from './index'
import { interval } from 'rxjs'
import { mapTo, startWith, scan } from 'rxjs/operators'

const Demo = defineComponent({
  setup() {
    const count = useObservable(interval(1000).pipe(
      mapTo(1),
      startWith(0),
      scan((total, next) => next + total),
    ))

    return {
      count,
    }
  },

  render(this: Vue & {count: any; update: any}) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          count is: { this.count }
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Add-ons|RxJS', module)
  .add('useObservable', () => Demo as any)
