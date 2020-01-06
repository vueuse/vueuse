# createI18n

> Create a global i18n instance to be reused

## Usage

`createI18n` received the [same options as `VueI18n`](https://kazupon.github.io/vue-i18n/api/#constructor-options)

```js
// i18n.js
import { createI18n } from '@vueuse/i18n'

export const useI18n = createI18n({
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
```

```js
import { useI18n } from './i18n'

new Vue({
  setup () {
    const { locale, t } = useI18n()

    const helloText = computed(() => t('hello'))

    return {
      locale,
      t,
      helloText,
    }
  },
})
```
