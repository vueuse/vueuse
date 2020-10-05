import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useHistory } from '.'
import { useCounter } from '..'
import dayjs from 'dayjs'

defineDemo(
  {
    name: 'useHistory',
    category: 'State',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const counter = useCounter()
      const format = (ts: number) => dayjs(ts).format()

      return {
        ...counter,
        ...useHistory(counter.count, {
          limit: 10,
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
        <button @click="undo()" :disabled='!history.length'>Undo</button>
        <button @click="redo()" :disabled='!redoHistory.length'>Redo</button>
        <br>
        <note>History (limited to 10 records)</note>
        <div class="ml-2">
          <div v-for='i in history' :key='i.timestamp'>
            <span class="opacity-50 mr-3 font-mono">{{format(i.timestamp)}}</span> <span class="font-mono">{ value: {{i.value}} }</span>
          </div>
        </div>
      </div>
    `,
  }),
)
