import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { computed, defineComponent, ref } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useTransition } from '.'

type Inject = {
  baseNumber: number
  cubicBezierNumber: number
  customFnNumber: number
}

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
  position: 'absolute' as 'absolute',
  transform: 'translateX(-50%)',
  width: '1rem',
}

const Demo = defineComponent({
  setup() {
    const baseNumber = ref(0)

    const easeInOutElastic = (x: number) => {
      const c5 = (2 * Math.PI) / 4.5
      return x === 0
        ? 0 : x === 1
          ? 1 : x < 0.5
            ? -(2 ** (20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2 : (2 ** (-20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1
    }

    const cubicBezierNumber = useTransition(baseNumber, {
      duration: 1500,
      transition: [0.75, 0, 0.25, 1],
    })

    const customFnNumber = useTransition(baseNumber, {
      duration: 1500,
      transition: easeInOutElastic,
    })

    return {
      baseNumber,
      cubicBezierNumber,
      customFnNumber,
    }
  },

  render(this: Vue & Inject) {
    const Docs = <ShowDocs md={require('./index.md')} />

    const onClick = () => {
      this.baseNumber = this.baseNumber === 100 ? 0 : 100
    }

    return (
      <div>
        <div id='demo'>
          <button onClick={onClick}>Transition</button>

          <p style={{ marginTop: '1rem' }}>
            Base number: <b>{this.baseNumber}</b>
          </p>

          <p style={{ marginTop: '1rem' }}>
            Cubic bezier curve: <b>{this.cubicBezierNumber}</b>
          </p>

          <div style={track}>
            <div style={{ position: 'relative' }}>
              <div style={{ ...sled, left: computed(() => `${this.cubicBezierNumber}%`).value }} />
            </div>
          </div>

          <p style={{ marginTop: '1rem' }}>
            Custom function: <b>{this.customFnNumber}</b>
          </p>

          <div style={track}>
            <div style={{ position: 'relative' }}>
              <div style={{ ...sled, left: computed(() => `${this.customFnNumber}%`).value }} />
            </div>
          </div>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Animation', module)
  .add('useTransition', () => Demo as any)
