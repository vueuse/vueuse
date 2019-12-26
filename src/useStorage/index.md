# useStorage

Reactive LocalStorage/SessionStorage.

Default to LocalStorage

## Usage

```jsx
import { useStorage } from '@vueuse/core'

export default {
  setup () {
    const { state, update } = useStorage('my-store', { locale: 'en' })
    // const { state, update } = useStorage('my-store', { locale: 'en' }, sessionStorage)

    state.locale = 'zh-cn'

    update()

    return {
      state,
    }
  },
}
```
