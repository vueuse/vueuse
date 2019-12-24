# useLocalStoragePlain

Reactive LocalStorage with plain string values

## Usage

```jsx
import { useLocalStoragePlain } from '@vueuse/core'

export default {
  setup () {
    const greeting = useLocalStoragePlain('my-store', 'hello')

    greeting.value = 'hi'

    return {
      greeting,
    }
  },
}
```
