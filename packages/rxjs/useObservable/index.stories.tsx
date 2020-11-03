import { defineComponent } from 'vue-demi'
import { useObservable } from './index'
import { interval } from 'rxjs'
import { mapTo, startWith, scan } from 'rxjs/operators'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'useObservable',
    category: '/RxJS',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
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
    template: html`
      <div>
        <note>Update every 1s</note>
        <p>Counter: {{count}}</p>
      </div>
    `,
  }),
)
