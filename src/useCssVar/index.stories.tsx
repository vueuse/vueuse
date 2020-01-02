import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent, ref } from '../api'
import { ShowDocs } from '../dev/storybook'
import { useCssVar } from '.'

const Demo = createComponent({
  setup () {
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

  render (this: Vue & any) {
    const {
      switchColor,
      color,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          {/*
          // @ts-ignore */}
          <p ref='el' style="--color:#7fa998; color: var(--color);">Sample text, {color}</p>
          <button onClick={switchColor}>Switch Color</button>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Browser', module)
  .add('useCssVar', () => Demo as any)
