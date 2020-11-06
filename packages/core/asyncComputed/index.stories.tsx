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
      const name = ref('@vueuse/core')
      const isFetching = ref(false)

      const downloads = asyncComputed(
        async(onCancel) => {
          const abortController = new AbortController()

          onCancel(() => abortController.abort())

          return await fetch(
            `https://api.npmjs.org/downloads/point/last-week/${name.value}`,
            { signal: abortController.signal },
          )
            .then(response => response.ok ? response.json() : { downloads: '—' })
            .then(result => result.downloads)
        },
        0,
        isFetching,
      )

      return { name, downloads, isFetching }
    },

    template: html`
      <div>
        <note>npm weekly downloads lookup</note>
        <input v-model="name" placeholder="npm package name"/>
        <p>Downloads: <b>{{ isFetching ? '...' : (downloads + ' / week') }}</b></p>
      </div>
    `,
  }),
)
