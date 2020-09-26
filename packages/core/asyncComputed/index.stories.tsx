import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { ref, defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { asyncComputed } from '.'

type Inject = {
  packageName: string
  downloads: number
  isFetchingDownloads: boolean
}

const Demo = defineComponent({
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

  render(this: Vue & Inject) {
    const { packageName, downloads, isFetchingDownloads } = this

    // @ts-ignore
    const Docs = <ShowDocs md={require('./index.md')}/>

    return (
      <div>
        <div id="demo">
          <p>
            npm Package: <input value={packageName} onChange={($event) => {
              this.packageName = $event.currentTarget.value
            }} /><br />
            Weekly Downloads: {isFetchingDownloads ? '...' : downloads}
          </p>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('State', module)
  .add('asyncComputed', () => Demo as any)
