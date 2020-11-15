import dayjs from 'dayjs'
import { defineDemo, html } from '../../_docs'
import { defineComponent, computed, ref } from 'vue-demi'
import { useWebWorkerFn, WorkerStatus } from '.'
import { useNow } from '../useNow'

const heavyTask = () => {
  const randomNumber = () => ~~(Math.random() * 5000000)
  const numbers: number[] = Array(1000000).fill(undefined).map(randomNumber)
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
      const time = useNow()
      const computedTime = computed(() => dayjs(time.value).format('YYYY-MM-DD HH:mm:ss SSS'))
      const running = computed(() => workerStatus.value === WorkerStatus.Runing)

      const data = ref()
      const runner = ref()

      const baseSort = () => {
        data.value = heavyTask()
        runner.value = 'Main'
      }
      const workerSort = async() => {
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
        <button @click="baseSort">
          Normal Sort
        </button>
        <button v-if="!running" @click="workerSort">
          Worker Sort
        </button>
        <button v-else @click="workerTerminate" class="orange">
          Terminate Worker
        </button>
        <note v-if="!data">Press buttons above to run heavy task. Clock stops when UI blocking happens.</note>
        <p v-else>
            Thread: <strong>{{runner}}</strong><br>
            Result: <strong>{{JSON.stringify(data)}}</strong>
        </p>
      </div>
    `,
  }),
)
