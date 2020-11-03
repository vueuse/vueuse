
import { defineComponent, ref } from 'vue-demi'
import { useSubscription } from '../useSubscription'
import { toObserver } from '../toObserver/index'
import { interval } from 'rxjs'
import { mapTo, takeUntil, withLatestFrom, startWith, map } from 'rxjs/operators'
import { defineDemo, html } from '../../_docs'
import { fromEvent, from } from '../from'

defineDemo(
  {
    name: 'toObserver',
    category: '/RxJS',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const count = ref(0)
      const button = ref<HTMLButtonElement>(null)

      useSubscription(
        interval(1000)
          .pipe(
            mapTo(1),
            takeUntil(fromEvent(button, 'click')),
            withLatestFrom(from(count).pipe(startWith(0))),
            map(([total, curr]) => curr + total),
          )
          .subscribe(toObserver(count)),
      )

      return {
        count,
        button,
      }
    },
    template: html`
      <div>
        <button @click="count++">count is: {{ count }}</button>
        <button ref="button">stop</button>
      </div>
    `,
  }),
)
