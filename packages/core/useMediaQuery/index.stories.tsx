import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { useMediaQuery } from '.'

const Demo = createComponent({
  setup () {
    return {
      isLargeScreen: useMediaQuery('(min-width: 1024px)'),
      prefersDark: useMediaQuery('(prefers-color-scheme: dark)'),
    }
  },

  render (this: Vue & any) {
    const {
      isLargeScreen,
      prefersDark,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <pre lang='json'>{JSON.stringify({
            isLargeScreen,
            prefersDark,
          }, null, 2)}</pre>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Browser', module)
  .add('useMediaQuery', () => Demo as any)
