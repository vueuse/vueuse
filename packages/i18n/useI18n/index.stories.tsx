import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { defineComponent } from 'vue-demi'
import { ShowDocs } from '../../_docs/showdocs'
import { useI18n } from '.'

const Demo = defineComponent({
  setup() {
    return useI18n({
      locale: 'en',
      messages: {
        en: {
          hello: 'Hello',
        },
        zhCN: {
          hello: '你好',
        },
      },
    })
  },

  render(this: Vue & any) {
    const {
      t,
      locale,
    } = this

    // @ts-ignore
    const Docs: any = <ShowDocs md={require('./index.md')} />

    return (
      <div>
        <div id='demo'>
          <note>Hello in {locale}</note>
          <p>{t('hello')}</p>
          <br></br>
          <button onClick={() => this.locale = locale === 'en' ? 'zhCN' : 'en'}>Switch</button>
        </div>
        {Docs}
      </div>
    )
  },
})

storiesOf('Add-ons|i18n', module)
  .add('useI18n', () => Demo as any)
