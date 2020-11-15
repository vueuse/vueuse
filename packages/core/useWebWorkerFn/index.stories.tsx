import dayjs from 'dayjs'
import { defineDemo, html } from '../../_docs'
import { defineComponent, computed, ref, nextTick } from 'vue-demi'
import { useWebWorkerFn } from '.'
import { useTimestamp } from '../useTimestamp'

const heavyTask = () => {
  const randomNumber = () => ~~(Math.random() * 5_000_000)
  const numbers: number[] = Array(5_000_000).fill(undefined).map(randomNumber)
  return numbers.sort().slice(0, 5)
}

defineDemo(
  {
    name: 'useWebWorkerFn',
    category: 'Misc',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const { workerFn, workerStatus, workerTerminate } = useWebWorkerFn(heavyTask)
      const { timestamp: time } = useTimestamp()
      const computedTime = computed(() => dayjs(time.value).format('YYYY-MM-DD HH:mm:ss SSS'))
      const running = computed(() => workerStatus.value === 'RUNNING')

      const data = ref()
      const runner = ref()

      const baseSort = async() => {
        data.value = null
        await nextTick()
        data.value = heavyTask()
        runner.value = 'Main'
      }
      const workerSort = async() => {
        data.value = null
        await nextTick()
        data.value = await workerFn()
        runner.value = 'Worker'
      }

      return {
        data,
        runner,
        running,
        baseSort,
        workerSort,
        computedTime,
        workerTerminate,
      }
    },

    template: html`
      <div>
        <p>Current Time: <strong></strong>{{computedTime}}</strong></p>
        <note>This is a demo showing sort for large array (5 milion numbers) with or w/o WebWorker.<br>Clock stops when UI blocking happends.</note>
        <button @click="baseSort">
          Sort in Main Thread
        </button>
        <button v-if="!running" @click="workerSort">
          Sort in Worker
        </button>
        <button v-else @click="workerTerminate" class="orange">
          Terminate Worker
        </button>
        <p v-if='data'>
          Thread: <strong>{{runner}}</strong><br>
          Result: <strong>{{JSON.stringify(data)}}</strong>
        </p>
      </div>
    `,
  }),
)
