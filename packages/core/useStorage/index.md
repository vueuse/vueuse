# useStorage

> Reactive [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)/[SessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)

## Usage

```jsx
import { useStorage } from '@vueuse/core'

const state = useStorage('my-store', { hello: 'hi', greeting: 'Hello' }, sessionStorage)
```
