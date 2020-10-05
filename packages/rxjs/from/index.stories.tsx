import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent, ref } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useSubscription } from '../useSubscription'
import { from, fromEvent } from './index'
import { toObserver } from '../toObserver/index'
import { interval } from 'rxjs'
import { mapTo, takeUntil, withLatestFrom, startWith, map } from 'rxjs/operators'

const Demo = defineComponent({
  setup() {
    const count = ref(0)
    const button = ref<HTMLButtonElement>(null)

    useSubscription(interval(1000).pipe(
      mapTo(1),
      takeUntil(fromEvent(button, 'click')),
      withLatestFrom(from(count).pipe(startWith(0))),
      map(([total, curr]) => curr + total),
    ).subscribe(toObserver(count)))

    return {
      count,
      button,
    }
  },

  render(this: Vue & {count: any; update: any}) {
    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id="demo">
          <button onClick={() => this.count++}>count is: { this.count }</button>
          <button ref="button">stop</button>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Add-ons|Rxjs', module)
  .add('from', () => Demo as any)
