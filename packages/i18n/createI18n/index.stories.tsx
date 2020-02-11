import 'vue-tsx-support/enable-check'
import Vue from 'vue'
import { storiesOf } from '@storybook/vue'
import { createComponent } from '../../api'
import { ShowDocs } from '../../_docs/showdocs'
import { createI18n } from '.'

const useI18n = createI18n({
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

const Demo = createComponent({
  setup() {
    return useI18n()
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
  .add('createI18n', () => Demo as any)
