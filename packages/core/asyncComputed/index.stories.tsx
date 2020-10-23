import { ref, defineComponent } from 'vue-demi'
import { asyncComputed } from '.'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'asyncComputed',
    category: 'Utilities',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup(_props) {
      const packageName = ref('@vueuse/core')

      const [downloads, isFetchingDownloads] = asyncComputed((onCancel) => {
        const abortController = new AbortController()

        onCancel(() => {
          abortController.abort()
        })

        return fetch(`https://api.npmjs.org/downloads/point/last-week/${packageName.value}`, {
          signal: abortController.signal,
        })
          .then(response => response.ok ? response.json() : { downloads: '—' })
          .then(result => result.downloads)
      }, 0)

      return { packageName, downloads, isFetchingDownloads }
    },

    template: html`
      <p>
        npm Package: <input :value="packageName" @change="packageName = $event.currentTarget.value"/>
        <br/>
        Weekly Downloads: {{ isFetchingDownloads ? '...' : downloads }}
      </p>
    `,
  }),
)
