import { defineComponent, ref } from 'vue-demi'
import { useSubscription } from '../useSubscription'
import { interval } from 'rxjs'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'useSubscription',
    category: '/RxJS',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const count = ref(0)
      useSubscription(interval(1000).subscribe(() => {
        count.value++
      }))
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
