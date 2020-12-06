import { defineComponent, ref, computed } from 'vue-demi'
import { useMousePressed } from '.'
import { defineDemo, html } from '../../_docs'
import { useToggle } from '@vueuse/shared/useToggle'

defineDemo(
  {
    name: 'useMousePressed',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const el = ref(null)
      const [withTarget, toggle] = useToggle()
      const target = computed(() => {
        if (withTarget.value)
          return el.value
        return window
      })
      return {
        el,
        withTarget,
        toggle,
        ...useMousePressed({ target }),
      }
    },

    template: html`
      <div ref='el' class="select-none">
        <pre>Pressed: {{ pressed }}</pre>
        <pre>Source Type: {{ JSON.stringify(sourceType) }}</pre>
        <br>
        <span @click='toggle' class="mt-4 underline cursor-pointer">{{ withTarget ? 'Tracking on this Demo section' : 'Tracking on Window' }}</span>
      </div>
    `,
  }),
)
