import dayjs from 'dayjs'
import { defineDemo, html } from '../../_docs'
import { defineComponent, computed } from 'vue-demi'
import { useWebWorkerFn } from '.'
import { useNow } from '../useNow'

const numbers: number[] = [...Array(5000000)].map(_ => ~~(Math.random() * 1000000))
const sortNumbers = (nums: number[]): number[] => nums.sort()

defineDemo(
  {
    name: 'useWebWorkerFn',
    category: 'Misc',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const { workerFn, workerStatus, workerTerminate } = useWebWorkerFn(sortNumbers)
      const time = useNow()
      const computedTime = computed(() => dayjs(time.value).format('YYYY-MM-DD HH:mm:ss SSS'))
      const running = computed(() => workerStatus.value === 'RUNNING')

      const baseSort = () => {
        const data = sortNumbers(numbers)
        console.log('Normal sort (top 10 of 5000000)', data.slice(0, 10))
      }

      const workerSort = async() => {
        const data = await workerFn(numbers)
        console.log('Worker sort (top 10 of 5000000)', data.slice(0, 10))
      }

      return {
        running,
        baseSort,
        workerSort,
        computedTime,
        workerTerminate,
      }
    },

    template: html`
      <div>
        <p>Current Time: {{computedTime}}</p>
        <note>Open console to see the sorted result. Clock stops when UI blocking happends.</note>
        <button @click="baseSort">
          Normal Sort
        </button>
        <button v-if="!running" @click="workerSort">
          Worker Sort
        </button>
        <button v-else @click="workerTerminate" class="orange">
          Terminate Worker
        </button>
      </div>
    `,
  }),
)
