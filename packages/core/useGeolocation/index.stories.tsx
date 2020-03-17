import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useGeolocation } from '.'

const Demo = defineComponent({
  setup() {
    return useGeolocation()
  },

  render(this: Vue & any) {
    const {
      coords,
      locatedAt,
      error,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <pre lang='json'>{JSON.stringify({
            coords,
            locatedAt,
            error: error ? error.message : error,
          }, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Sensors', module)
  .add('useGeolocation', () => Demo as any)
