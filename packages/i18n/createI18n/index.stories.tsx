import { defineComponent } from 'vue-demi'
import { defineDemo, html } from '../../_docs'
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

defineDemo(
  {
    name: 'createI18n',
    category: '@i18n',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
    setup() {
      return useI18n()
    },

    template: html`
      <div>
        <note>Hello in {{locale}}</note>
        <p>{{t('hello')}}</p>
        <br></br>
        <button @click="locale = (locale === 'en' ? 'zhCN' : 'en')">Switch</button>
      </div>
    `,
  }),
)
