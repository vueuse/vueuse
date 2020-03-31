import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { usePermission } from '.'

const Demo = defineComponent({
  setup() {
    return {
      geolocation: usePermission('geolocation'),
      microphone: usePermission('microphone'),
      notifications: usePermission('notifications'),
      camera: usePermission('camera'),
      midi: usePermission('midi'),
    }
  },

  render(this: Vue & any) {
    const {
      geolocation,
      microphone,
      notifications,
      camera,
      speaker,
      midi,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <pre lang='json'>{
            JSON.stringify({
              geolocation,
              microphone,
              notifications,
              camera,
              speaker,
              midi,
            }, null, 2)
          }</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Browser', module)
  .add('usePermission', () => Demo as any)
