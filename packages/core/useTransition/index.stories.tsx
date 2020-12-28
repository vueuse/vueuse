import { defineComponent, ref } from 'vue-demi'
import { useTransition } from '.'
import { defineDemo, html } from '../../_docs'

const track = {
  background: 'rgba(255, 255, 255, 0.15)',
  borderRadius: '1rem',
  height: '1rem',
  margin: '0.5rem',
  maxWidth: '20rem',
  padding: '0 0.5rem',
  width: '100%',
}

const sled = {
  background: '#68d391',
  borderRadius: '50%',
  height: '1rem',
  position: 'absolute' as const,
  transform: 'translateX(-50%)',
  width: '1rem',
}

defineDemo(
  {
    name: 'useTransition',
    category: 'Animation',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const baseNumber = ref(0)
      const duration = ref(1000)

      const easeOutElastic = (n: number) => {
        return n === 0
          ? 0
          : n === 1
            ? 1
            : (2 ** (-10 * n)) * Math.sin((n * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1
      }

      const cubicBezierNumber = useTransition(baseNumber, {
        duration,
        transition: [0.75, 0, 0.25, 1],
      })

      const customFnNumber = useTransition(baseNumber, {
        duration,
        transition: easeOutElastic,
      })

      return {
        toggle() {
          baseNumber.value = baseNumber.value === 100 ? 0 : 100
        },
        baseNumber,
        cubicBezierNumber,
        customFnNumber,
        duration,
        track,
        sled,
      }
    },

    template: html`
      <div>
        <button @click="toggle">Transition</button>

        <p class="mt-2">
          Duration:
          <label class="ml-2">
            <input v-model="duration" type="radio" :value="1000" /> 1000ms
          </label>
          <label class="ml-2">
            <input v-model="duration" type="radio" :value="5000" /> 5000ms
          </label>
          <label class="ml-2">
            <input v-model="duration" type="radio" :value="10000" /> 10000ms
          </label>
        </p>

        <p class="mt-2">
          Base number: <b>{{ baseNumber }}</b>
        </p>

        <p class="mt-2">
          Cubic bezier curve: <b>{{ cubicBezierNumber.toFixed(2) }}</b>
        </p>

        <div :style="track">
          <div class="relative">
            <div :style="{ ...sled, left: cubicBezierNumber + '%' }" />
          </div>
        </div>

        <p class="mt-2">
          Custom function: <b>{{ customFnNumber.toFixed(2) }}</b>
        </p>

        <div :style="track">
          <div class="relative">
            <div :style="{ ...sled, left: customFnNumber + '%' }" />
          </div>
        </div>
      </div>
    `,
  }),
)
