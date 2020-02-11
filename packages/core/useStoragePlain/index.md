# useStoragePlain

> Reactive LocalStorage/SessionStorage with primitives values

## Usage

```jsx
import { useStoragePlain } from '@vueuse/core'

export default {
  setup () {
    const greeting = useStoragePlain('my-store', 'hello')

    greeting.value = 'hi'

    return {
      greeting,
    }
  },
}
```
