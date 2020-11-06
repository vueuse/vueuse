import { defineDemo, html } from '../../_docs'
import { defineComponent, computed } from 'vue-demi'
import { useIdle } from '.'
import { useNow } from '../useNow'

defineDemo(
  {
    name: 'useIdle',
    category: 'Sensors',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const { idle, lastActive } = useIdle(5000, {
        throttleDelay: 20,
      })

      const now = useNow()

      const idledFor = computed(() => Math.floor((now.value - lastActive.value) / 1000))

      return {
        idle,
        lastActive,
        now,
        idledFor,
      }
    },

    template: html`
      <div>
          <note>For demonstraction purpose, the idle timout is set to <b>5s</b> in this demo (default 1min).</note>
          <p>Idle: {{idle}}</p>
          <p>Inactive: {{idledFor}}s</p>
      </div>
    `,
  }),
)
