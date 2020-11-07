import { defineComponent } from 'vue-demi'
import { useI18n } from '.'
import { defineDemo, html } from '../../_docs'

defineDemo(
  {
    name: 'useI18n',
    category: '@i18n',
    docs: require('./index.md'),
    module,
  },
  defineComponent({
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
