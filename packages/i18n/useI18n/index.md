# useI18n

> Use vue-i18n instance

## Usage

`useI18n` received the [same options as `VueI18n`](https://kazupon.github.io/vue-i18n/api/#constructor-options)

```js
import { useI18n } from '@vueuse/i18n'

new Vue({
  setup () {
    const { locale, t } = useI18n()
    
    const helloText = computed(()=>t('hello'))

    return { 
      locale, 
      t,
      helloText,
    }
  },
})
```
