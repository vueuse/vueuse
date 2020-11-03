import { defineDemo, html } from '../../_docs'
import { defineComponent, ref } from 'vue-demi'
import { useCssVar } from '.'

defineDemo(
  {
    name: 'useCssVar',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      const el = ref(null)
      const color = useCssVar('--color', el)

      const switchColor = () => {
        if (color.value === '#df8543')
          color.value = '#7fa998'
        else
          color.value = '#df8543'
      }

      return {
        el,
        color,
        switchColor,
      }
    },

    template: html`
      <div>
          <p ref="el" style="--color:#7fa998; color: var(--color);">Sample text, {{color}}</p>
          <button @click="switchColor">Switch Color</button>
      </div>
    `,
  }),
)
