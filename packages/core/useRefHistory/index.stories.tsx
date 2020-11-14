import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useRefHistory } from '.'
import { useCounter } from '..'
import dayjs from 'dayjs'

defineDemo(
  {
    name: 'useRefHistory',
    category: 'Utilities',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const counter = useCounter()
      const format = (ts: number) => dayjs(ts).format()

      return {
        ...counter,
        ...useRefHistory(counter.count, {
          capacity: 10,
        }),
        format,
      }
    },

    template: html`
      <div>
        <p>Count: {{count}}</p>
        <button @click="inc()">Increment</button>
        <button @click="dec()">Decrement</button>
        <span class="mx-2">/</span>
        <button @click="undo()" :disabled='!canUndo'>Undo</button>
        <button @click="redo()" :disabled='!canRedo'>Redo</button>
        <br>
        <note>History (limited to 10 records for demo)</note>
        <div class="ml-2">
          <div v-for='i in history' :key='i.timestamp'>
            <span class="opacity-50 mr-3 font-mono">{{format(i.timestamp)}}</span> <span class="font-mono">{ value: {{i.snapshot}} }</span>
          </div>
        </div>
      </div>
    `,
  }),
)
