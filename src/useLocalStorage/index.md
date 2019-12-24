# useLocalStorage

Reactive LocalStorage

## Usage

```jsx
import { useLocalStorage } from '@vueuse/core'

export default {
  setup () {
    const { state, update } = useLocalStorage('my-store', { locale: 'en' })

    state.locale = 'zh-cn'

    update()

    return {
      state,
    }
  },
}
```
