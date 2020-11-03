import { defineDemo, html } from '../../_docs'
import { defineComponent } from 'vue-demi'
import { useMediaQuery } from '.'

defineDemo(
  {
    name: 'useMediaQuery',
    category: 'Browser',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return {
        isLargeScreen: useMediaQuery('(min-width: 1024px)'),
        prefersDark: useMediaQuery('(prefers-color-scheme: dark)'),
      }
    },

    template: html`
      <div>
        <pre lang="json">{{JSON.stringify({
            isLargeScreen,
            prefersDark,
          }, null, 2)}}
        </pre>
      </div>
    `,
  }),
)
