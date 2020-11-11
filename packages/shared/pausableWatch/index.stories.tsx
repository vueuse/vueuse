import { defineComponent, ref } from 'vue-demi'
import { pausableWatch } from '.'
import { defineDemo, html } from '../../_docs'
import { onStartTyping } from '../../core'

defineDemo(
  {
    name: 'pausableWatch',
    category: 'Watch',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const input = ref<HTMLInputElement | null>()
      const log = ref('')

      const source = ref('')

      const clear = () => {
        log.value = ''
      }

      const { pause, resume, isActive } = pausableWatch(source, v => log.value += `Changed to "${v}"\n`)

      onStartTyping(() => input.value?.focus())

      return {
        input,
        log,
        source,
        clear,
        pause: () => {
          log.value += 'Paused\n'
          pause()
        },
        resume: () => {
          log.value += 'Resumed\n'
          resume()
        },
        isActive,
      }
    },
    template: html`
      <div>
        <input v-model='source' ref='input' placeholder='Type something to trigger the watch'/>

        <button @click='pause' :disabled='!isActive' class='orange'>Pause</button>
        <button @click='resume' :disabled='isActive'>Resume</button>
        <button @click='clear'>Clear Log</button>

        <br>

        <note>Log</note>

        <pre>{{log}}</pre>
      </div>
    `,
  }),
)
